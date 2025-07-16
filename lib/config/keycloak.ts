import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: 'https://keycloak.shypri.com',
  realm: 'timexpress',
  clientId: 'chatess-id'
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak; 