# 🔐 Password Analyzer

> Application web moderne d'analyse de robustesse et d'entropie de mots de passe en temps réel, conçue avec un thème sombre **Cybersecurity** et une pluie d'animation Matrix.

![Python](https://img.shields.io/badge/Python-3.10%2B-blue?logo=python)
![Flask](https://img.shields.io/badge/Flask-3.0%2B-black?logo=flask)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Fonctionnalités

- **⚡ Analyse en temps réel** : Évaluation instantanée au fur et à mesure de la frappe (requête AJAX debouncée).
- **📊 Score de robustesse (0 - 100)** : Jauge colorée dynamique (Très faible → Très fort).
- **🧮 Calcul d'entropie (bits)** : Calcul mathématique exact de la complexité combinatoire ($\log_2(\text{charset}^{\text{longueur}})$).
- **⚠️ Détection de mots de passe courants** : Alerte immédiate si le mot de passe fait partie des listes de fuites/mots de passe fréquents (`123456`, `azerty`, `admin`, etc.).
- **📋 Checklist de sécurité interactive** :
  - Longueur minimale (8+ et 12+ caractères)
  - Lettres minuscules (a–z)
  - Lettres majuscules (A–Z)
  - Chiffres (0–9)
  - Caractères spéciaux & symboles (!@#$%...)
  - Détection des séquences (`123`, `abc`) et répétitions (`aaa`)
- **💡 Conseils personnalisés** : Recommandations contextuelles en direct pour renforcer votre mot de passe.
- **🎨 Interface Cyberpunk / Matrix** :
  - Animation de pluie Matrix en arrière-plan (HTML5 Canvas)
  - Effet de verre (Glassmorphism) et bordures néon
  - Bouton afficher / masquer le mot de passe (œil 👁️)
- **🔒 100% Local & Sécurisé** : Vos mots de passe ne quittent jamais votre machine (aucun stockage, aucune télémétrie).

---

## 🚀 Installation & Lancement

### 1. Prérequis
- [Python 3.10+](https://www.python.org/)

### 2. Cloner le dépôt
```bash
git clone https://github.com/VOTRE_NOM_UTILISATEUR/password-analyzer.git
cd password-analyzer
```

### 3. Installer les dépendances
```bash
pip install -r requirements.txt
```

### 4. Lancer l'application

```bash
python app.py
```

Rendez-vous ensuite sur [http://127.0.0.1:5050](http://127.0.0.1:5050) dans votre navigateur web.

---

## 🛠️ Technologies utilisées

- **Backend** : Python, Flask
- **Frontend** : HTML5, CSS3 pur (Custom Properties, Flexbox, Animations), JavaScript pur (Fetch API, Canvas API)
- **Sécurité** : Analyse locale sans persistance

---

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.
