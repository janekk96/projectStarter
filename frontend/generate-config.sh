#!/bin/bash

# Generate config.js from environment variables
cat > ./public/config.js << EOF
window.config = {
  apiUrl: "${REACT_APP_API_URL:-http://localhost/api}",
  auth: {
    keycloakUrl: "${REACT_APP_KEYCLOAK_URL:-http://localhost/auth}",
    keycloakRealm: "${REACT_APP_KEYCLOAK_REALM:-myrealm}",
    keycloakClientId: "${REACT_APP_KEYCLOAK_CLIENT_ID:-myclient}",
  },
};
EOF

echo "Generated config.js with environment variables"
