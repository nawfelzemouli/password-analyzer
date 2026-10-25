import math
import re
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

COMMON_PASSWORDS = {
    "password", "123456", "123456789", "qwerty", "abc123",
    "password1", "iloveyou", "admin", "letmein", "monkey",
    "dragon", "master", "sunshine", "princess", "welcome",
    "shadow", "azerty", "motdepasse", "bonjour", "soleil",
    "superman", "batman", "trustno1", "hello", "charlie",
    "donald", "password123", "qwerty123", "1q2w3e4r",
    "111111", "000000", "121212", "654321", "1234567",
    "12345678", "1234567890", "987654321", "qwertyuiop",
    "mypassword", "passw0rd", "p@ssword", "p@ssw0rd",
    "nicole", "jessica", "michael", "daniel", "jordan",
    "liverpool", "chelsea", "arsenal", "football", "baseball",
    "pokemon", "starwars", "minecraft", "computer", "internet",
}


def has_repeated_chars(password: str) -> bool:
    for i in range(len(password) - 2):
        if password[i] == password[i + 1] == password[i + 2]:
            return True
    return False


def has_sequential_chars(password: str) -> bool:
    sequences = [
        "abcdefghijklmnopqrstuvwxyz",
        "0123456789",
        "qwertyuiop",
        "asdfghjkl",
        "zxcvbnm",
    ]
    lower = password.lower()
    for seq in sequences:
        for i in range(len(seq) - 2):
            chunk = seq[i:i + 3]
            if chunk in lower or chunk[::-1] in lower:
                return True
    return False


def compute_score(password: str, criteria: dict, is_common: bool) -> int:
    score = 0
    length = criteria["length"]

    if length >= 12:
        score += 30
    elif length >= 10:
        score += 25
    elif length >= 8:
        score += 20
    elif length >= 6:
        score += 10

    if criteria["has_lower"]:
        score += 10
    if criteria["has_upper"]:
        score += 10
    if criteria["has_digit"]:
        score += 10
    if criteria["has_symbol"]:
        score += 15

    if not has_repeated_chars(password):
        score += 5

    if not has_sequential_chars(password):
        score += 5

    if not is_common:
        score += 15

    return min(score, 100)


def compute_entropy(password: str, criteria: dict) -> float:
    charset_size = 0
    if criteria["has_lower"]:
        charset_size += 26
    if criteria["has_upper"]:
        charset_size += 26
    if criteria["has_digit"]:
        charset_size += 10
    if criteria["has_symbol"]:
        charset_size += 32
    if charset_size == 0:
        return 0.0
    entropy = math.log2(charset_size) * criteria["length"]
    return round(entropy, 2)


def get_label(score: int) -> str:
    if score <= 20:
        return "Très faible"
    elif score <= 40:
        return "Faible"
    elif score <= 60:
        return "Moyen"
    elif score <= 80:
        return "Fort"
    else:
        return "Très fort"


def generate_tips(password: str, criteria: dict, is_common: bool, score: int) -> list:
    tips = []

    if is_common:
        tips.append("⚠️ Ce mot de passe est trop commun — choisissez-en un plus original.")

    if criteria["length"] < 12:
        deficit = 12 - criteria["length"]
        tips.append(
            f"Allongez votre mot de passe d'au moins {deficit} caractère(s) (objectif : 12+)."
        )

    if not criteria["has_upper"]:
        tips.append("Ajoutez des lettres majuscules (A–Z) pour plus de variété.")

    if not criteria["has_lower"]:
        tips.append("Ajoutez des lettres minuscules (a–z) pour plus de variété.")

    if not criteria["has_digit"]:
        tips.append("Incorporez des chiffres (0–9) dans votre mot de passe.")

    if not criteria["has_symbol"]:
        tips.append(
            "Ajoutez des symboles (!@#$%^&*...) pour renforcer considérablement votre mot de passe."
        )

    if has_repeated_chars(password):
        tips.append("Évitez les caractères répétés consécutivement (ex. : 'aaa', '111').")

    if has_sequential_chars(password):
        tips.append("Évitez les séquences prévisibles (ex. : 'abc', '123', 'qwerty').")

    if score >= 80 and not tips:
        tips.append(
            "Excellent mot de passe ! Pensez à utiliser un gestionnaire de mots de passe pour le mémoriser en toute sécurité."
        )

    return tips


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json(force=True)
    password = data.get("password", "")

    if not isinstance(password, str):
        return jsonify({"error": "Mot de passe invalide"}), 400

    symbols = set('!@#$%^&*()-_=+[]{}|;:\'",.<>?/`~\\')

    criteria = {
        "length": len(password),
        "has_lower": bool(re.search(r"[a-z]", password)),
        "has_upper": bool(re.search(r"[A-Z]", password)),
        "has_digit": bool(re.search(r"\d", password)),
        "has_symbol": any(c in symbols for c in password),
    }

    is_common = password.lower() in COMMON_PASSWORDS

    score = compute_score(password, criteria, is_common)
    label = get_label(score)
    entropy = compute_entropy(password, criteria)
    tips = generate_tips(password, criteria, is_common, score)

    return jsonify({
        "score": score,
        "label": label,
        "entropy": entropy,
        "is_common": is_common,
        "criteria": criteria,
        "tips": tips,
    })


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5050)
