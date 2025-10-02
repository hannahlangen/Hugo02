# Deployment-Dokumentation für Hugo at Work

## 📋 Übersicht

Dieses Dokument beschreibt den Deployment-Prozess für die Hugo at Work Plattform.

## 🔐 Wichtige Dateien

### `.deployment-guide.md`
- **Zweck:** Enthält alle Zugangsdaten und detaillierte Deployment-Anweisungen
- **Sicherheit:** ⚠️ NIEMALS zu Git committen! (ist in .gitignore)
- **Inhalt:** Server-Zugangsdaten, SSH-Befehle, Test-Accounts, URLs
- **Zugriff:** Nur für autorisierte Entwickler

### `quick-deploy.sh`
- **Zweck:** Interaktives Deployment-Script für schnelle Deployments
- **Verwendung:** `./quick-deploy.sh`
- **Features:**
  - Automatischer Git Push (optional)
  - Auswahl: Frontend, Backend oder Alles
  - Automatische Health-Checks
  - Farbige Status-Meldungen

### `deploy.sh`
- **Zweck:** Vollständiges Deployment-Script mit Tests
- **Verwendung:** `./deploy.sh`
- **Features:**
  - Komplettes Setup von Grund auf
  - Docker-Checks
  - Service-Health-Checks
  - API-Tests

### `deploy_team_features.sh`
- **Zweck:** Spezielles Script für Team-Features
- **Verwendung:** `./deploy_team_features.sh`
- **Features:**
  - Frontend-Build
  - Service-Restart
  - Health-Checks

## 🚀 Schnellstart

### Einfaches Deployment (empfohlen)

```bash
# 1. Zum Projekt-Verzeichnis wechseln
cd /home/ubuntu/hugo-app-archiv

# 2. Quick-Deploy-Script ausführen
./quick-deploy.sh

# 3. Deployment-Typ wählen (1-4)
# 4. Fertig!
```

### Manuelles Deployment

```bash
# 1. Änderungen zu GitHub pushen
git add .
git commit -m "feat: Beschreibung"
git push origin develop

# 2. SSH zum Server
ssh manus02@157.90.170.80
# Passwort: exjh7a

# 3. Auf dem Server
cd ~/hugo-app-archiv
git pull origin develop
docker compose up -d --build frontend
```

### Ein-Zeilen-Deployment

```bash
# Nur Frontend
sshpass -p 'exjh7a' ssh manus02@157.90.170.80 "cd ~/hugo-app-archiv && git pull origin develop && docker compose up -d --build frontend"

# Alles
sshpass -p 'exjh7a' ssh manus02@157.90.170.80 "cd ~/hugo-app-archiv && git pull origin develop && docker compose up -d --build"
```

## 📦 Deployment-Szenarien

### Szenario 1: Nur Frontend-Änderungen
**Wann:** React-Komponenten, CSS, UI-Änderungen

```bash
./quick-deploy.sh
# Wähle Option 1: Nur Frontend
```

**Dauer:** ~2-3 Minuten

### Szenario 2: Nur Backend-Änderungen
**Wann:** API-Änderungen, Business-Logik

```bash
./quick-deploy.sh
# Wähle Option 2: Nur Backend-Services
```

**Dauer:** ~3-4 Minuten

### Szenario 3: Vollständiges Deployment
**Wann:** Große Features, mehrere Services betroffen

```bash
./quick-deploy.sh
# Wähle Option 3: Alles
```

**Dauer:** ~5-7 Minuten

### Szenario 4: Nur Code-Update (kein Rebuild)
**Wann:** Konfigurationsänderungen, Dokumentation

```bash
./quick-deploy.sh
# Wähle Option 4: Nur Git Pull
```

**Dauer:** ~30 Sekunden

## 🔍 Nach dem Deployment prüfen

### 1. Services-Status
```bash
ssh manus02@157.90.170.80
cd ~/hugo-app-archiv
docker compose ps
```

Alle Services sollten "Up" sein.

### 2. Frontend erreichbar
```bash
curl http://157.90.170.80:3000
```

Oder im Browser: http://157.90.170.80:3000

### 3. API-Health-Checks
```bash
curl http://157.90.170.80:8001/health  # User Service
curl http://157.90.170.80:8002/health  # Hugo Engine
curl http://157.90.170.80:8003/health  # Assessment Service
curl http://157.90.170.80:8004/health  # Team Service
curl http://157.90.170.80:8005/health  # Chat Assessment
```

### 4. Logs prüfen
```bash
docker compose logs -f frontend
docker compose logs -f team-service
# Ctrl+C zum Beenden
```

## 🐛 Troubleshooting

### Problem: Service startet nicht

```bash
# Logs anzeigen
docker compose logs [service-name]

# Service neu starten
docker compose restart [service-name]

# Kompletter Rebuild
docker compose up -d --build [service-name]
```

### Problem: Frontend zeigt alte Version

```bash
# Browser-Cache leeren (Strg+Shift+R)
# Oder Frontend neu bauen:
docker compose up -d --build frontend
```

### Problem: "Permission denied" beim SSH

```bash
# Prüfe Zugangsdaten in .deployment-guide.md
# Oder verwende sshpass:
sshpass -p 'exjh7a' ssh manus02@157.90.170.80
```

### Problem: Git Pull schlägt fehl

```bash
# Auf dem Server:
cd ~/hugo-app-archiv
git status
git reset --hard origin/develop
git pull origin develop
```

## 📊 Deployment-Checkliste

### Vor dem Deployment
- [ ] Code lokal getestet
- [ ] Alle Tests laufen durch
- [ ] Keine Merge-Konflikte
- [ ] Commit-Message ist aussagekräftig
- [ ] Zu GitHub gepusht

### Während des Deployments
- [ ] Deployment-Script ausgeführt
- [ ] Keine Fehler in der Ausgabe
- [ ] Services starten erfolgreich

### Nach dem Deployment
- [ ] Frontend lädt korrekt
- [ ] APIs antworten
- [ ] Keine Fehler in Logs
- [ ] Neue Features funktionieren
- [ ] Bestehende Features funktionieren noch
- [ ] Team informiert

## 🔒 Sicherheit

### Wichtige Regeln

1. **Niemals Zugangsdaten committen**
   - `.deployment-guide.md` ist in .gitignore
   - Passwörter nur in sicheren Dateien

2. **SSH-Keys verwenden (Production)**
   - Für Development ist Passwort OK
   - Für Production SSH-Keys einrichten

3. **Regelmäßig Passwörter ändern**
   - Mindestens alle 90 Tage
   - Nach Mitarbeiter-Wechsel

4. **Zugriff dokumentieren**
   - Wer hat Zugriff?
   - Wann wurde Zugriff gewährt?

## 📞 Support

### Bei Problemen

1. **Logs prüfen:** `docker compose logs -f`
2. **Dokumentation lesen:** Diese Datei + `.deployment-guide.md`
3. **Team fragen:** Slack/Email
4. **Incident dokumentieren:** Was, Wann, Warum

### Kontakte

- **DevOps:** [Name/Email]
- **Backend:** [Name/Email]
- **Frontend:** [Name/Email]

## 📚 Weitere Ressourcen

- **`.deployment-guide.md`** - Detaillierte Anweisungen & Zugangsdaten
- **`README.md`** - Projekt-Übersicht
- **`TEAM_FEATURES_FINAL_REPORT.md`** - Team-Features-Dokumentation
- **API Docs:** http://157.90.170.80:8001/docs

## 🎯 Best Practices

1. **Kleine, häufige Deployments**
   - Besser als große, seltene Deployments
   - Einfacher zu debuggen

2. **Immer testen nach Deployment**
   - Nicht blind vertrauen
   - Kritische Funktionen manuell prüfen

3. **Logs im Auge behalten**
   - Erste Minuten nach Deployment
   - Auf Fehler achten

4. **Rollback-Plan haben**
   - Bei Problemen: `git revert`
   - Oder: Alten Container-Image verwenden

5. **Team informieren**
   - Vor großen Deployments
   - Nach erfolgreichen Deployments

---

**Letzte Aktualisierung:** 2. Oktober 2025  
**Nächste Überprüfung:** 2. Januar 2026

Bei Fragen oder Problemen: Siehe `.deployment-guide.md` für Kontakte
