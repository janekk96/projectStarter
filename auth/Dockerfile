FROM quay.io/keycloak/keycloak:25.0.6 as builder

ENV KEYCLOAK_ADMIN=admin
ENV KEYCLOAK_ADMIN_PASSWORD=admin

ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true

# Construisez la configuration de Keycloak

RUN /opt/keycloak/bin/kc.sh build

ENV KC_DB=postgres
WORKDIR /opt/keycloak

# for demonstration purposes only, please make sure to use proper certificates in production instead

RUN keytool -genkeypair -storepass password -storetype PKCS12 -keyalg RSA -keysize 2048 -dname "CN=server" -alias server -ext "SAN:c=DNS:localhost,IP:127.0.0.1" -keystore conf/server.keystore
RUN /opt/keycloak/bin/kc.sh build

# Étape finale pour démarrer Keycloak

FROM quay.io/keycloak/keycloak:25.0.6

# Copier les fichiers de la phase de construction

COPY --from=builder /opt/keycloak/ /opt/keycloak/

# Définir les variables d'environnement pour la base de données et Keycloak

ENV KC_DB=postgres
ENV KC_DB_URL=jdbc:postgresql://postgres/keycloak
ENV KC_DB_USERNAME=newkeycloakuser
ENV KC_DB_PASSWORD=password
ENV KC_HOSTNAME=localhost
ENV KC_DB_SCHEMA=public

# Utiliser "start-dev" pour rester en mode développement

ENTRYPOINT \["/opt/keycloak/bin/kc.sh", "start-dev"\]