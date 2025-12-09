// api.js - Versão Segura com Placeholders

// Vamos substituir estes valores durante o build do Docker
const CHATWOOT_URL = '__CHATWOOT_URL__';
const ACCOUNT_ID = '__ACCOUNT_ID__';
const TOKEN = '__CHATWOOT_TOKEN__'; 

const chatwootHeaders = {
  'Content-Type': 'application/json',
  'api_access_token': TOKEN
};

// Função de log segura
const log = (...args) => {
    // Descomente abaixo se quiser logs no console do navegador
    // console.log('[KanbanWoot]', ...args);
};

async function chatwootFetch(endpoint, options = {}) {
  const url = `${CHATWOOT_URL}/api/v1/accounts/${ACCOUNT_ID}${endpoint}`;
  
  try {
    const response = await fetch(url, { ...options, headers: chatwootHeaders });
    const responseText = await response.text();
    let responseData;
    
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }
    
    if (!response.ok) {
        // Tratamento de erro simplificado
      console.error(`Erro na API: ${url} ${response.status}`);
      throw new Error(`Erro API Chatwoot: ${response.status}`);
    }
    return responseData;
  } catch (error) {
    console.error('Erro na requisição Chatwoot:', error);
    throw error;
  }
}

// Funções exportadas mantidas iguais
export async function getContacts() {
  try {
    const data = await chatwootFetch('/contacts');
    return data.payload || [];
  } catch (error) { throw error; }
}

export async function getCustomAttributes() {
  try {
    const data = await chatwootFetch('/custom_attribute_definitions');
    const all = data.payload || data || [];
    return Array.isArray(all) ? all.filter(attr => attr.attribute_model === 'contact_attribute') : [];
  } catch (error) { throw error; }
}

export async function getCustomAttributeById(id) {
  try {
    const data = await chatwootFetch(`/custom_attribute_definitions/${id}`);
    return data.payload || data;
  } catch (error) { throw error; }
}

export async function updateContactCustomAttribute(contactId, attributeKey, value) {
  try {
    return await chatwootFetch(`/contacts/${contactId}`, {
      method: 'PUT',
      body: JSON.stringify({ custom_attributes: { [attributeKey]: value } })
    });
  } catch (error) { throw error; }
}
