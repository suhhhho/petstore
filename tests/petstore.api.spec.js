const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://petstore.swagger.io/v2';

function api(path) {
  return `${BASE_URL}/${path}`;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createPetPayload(petId) {
  return {
    id: petId,
    category: { id: 1, name: 'dogs' },
    name: `qa-dog-${petId}`,
    photoUrls: ['https://example.com/dog.png'],
    tags: [{ id: 1, name: 'qa' }],
    status: 'available'
  };
}

function createUserPayload(username) {
  return {
    id: randomInt(100000, 999999),
    username,
    firstName: 'QA',
    lastName: 'Engineer',
    email: `${username}@example.com`,
    password: 'Pa55word!',
    phone: '000111222',
    userStatus: 1
  };
}

async function waitForPetAvailability(request, petId, retries = 6, delayMs = 500) {
  for (let attempt = 0; attempt < retries; attempt += 1) {
    const response = await request.get(api(`pet/${petId}`));
    if (response.status() === 200) {
      return response;
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  return request.get(api(`pet/${petId}`));
}

test.describe('Swagger Petstore API', () => {
  test('GET /store/inventory returns stock counts', async ({ request }) => {
    const response = await request.get(api('store/inventory'));

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();
    expect(typeof body).toBe('object');
    expect(Array.isArray(body)).toBe(false);
  });

  test('GET /pet/findByStatus with query parameter returns matching pets', async ({ request }) => {
    const response = await request.get(api('pet/findByStatus'), {
      params: { status: 'available' }
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(Array.isArray(body)).toBe(true);
    if (body.length > 0) {
      expect(body[0]).toHaveProperty('status');
    }
  });

  test('POST + GET + PUT + DELETE /pet lifecycle flow', async ({ request }) => {
    const petId = Date.now() + randomInt(100, 999);
    const createdPet = createPetPayload(petId);

    const createResponse = await request.post(api('pet'), { data: createdPet });
    expect(createResponse.status()).toBe(200);

    const getCreatedResponse = await waitForPetAvailability(request, petId);
    expect(getCreatedResponse.status()).toBe(200);
    const fetchedPet = await getCreatedResponse.json();
    expect(fetchedPet.id).toBe(petId);
    expect(fetchedPet.name).toBe(createdPet.name);

    const updatedPet = { ...fetchedPet, status: 'sold', name: `${fetchedPet.name}-updated` };
    const updateResponse = await request.put(api('pet'), { data: updatedPet });
    expect(updateResponse.status()).toBe(200);

    const getUpdatedResponse = await request.get(api(`pet/${petId}`));
    expect(getUpdatedResponse.status()).toBe(200);
    const updatedBody = await getUpdatedResponse.json();
    expect(updatedBody.status).toBe('sold');
    expect(updatedBody.name).toBe(updatedPet.name);

    const deleteResponse = await request.delete(api(`pet/${petId}`));
    expect(deleteResponse.status()).toBe(200);

    const getDeletedResponse = await request.get(api(`pet/${petId}`));
    expect(getDeletedResponse.status()).toBe(404);
  });

  test('Negative: GET /pet/{petId} with invalid path parameter returns error', async ({ request }) => {
    const response = await request.get(api('pet/not-a-number'));

    expect([400, 404, 405]).toContain(response.status());
  });

  test('Edge case: GET /pet/{petId} with very large ID', async ({ request }) => {
    const veryLargePetId = '9223372036854775807';
    const response = await request.get(api(`pet/${veryLargePetId}`));

    expect([200, 404]).toContain(response.status());
    if (response.status() === 200) {
      const body = await response.json();
      expect(body).toHaveProperty('id');
    }
  });

  test('POST + GET + DELETE /user flow using path and query parameters', async ({ request }) => {
    const username = `qa_user_${Date.now()}`;
    const user = createUserPayload(username);

    const createResponse = await request.post(api('user'), { data: user });
    expect(createResponse.status()).toBe(200);

    const loginResponse = await request.get(api('user/login'), {
      params: { username: user.username, password: user.password }
    });
    expect(loginResponse.status()).toBe(200);

    const getResponse = await request.get(api(`user/${username}`));
    expect(getResponse.status()).toBe(200);
    const userBody = await getResponse.json();
    expect(userBody.username).toBe(username);

    const deleteResponse = await request.delete(api(`user/${username}`));
    expect(deleteResponse.status()).toBe(200);

    const getDeletedResponse = await request.get(api(`user/${username}`));
    expect(getDeletedResponse.status()).toBe(404);
  });
});
