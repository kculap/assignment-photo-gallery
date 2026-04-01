import path from 'path';

export const BASE_URL = 'https://demo.baasic.com/angular/starterkit-photo-gallery';

export const TEST_IMAGE_PATH = path.join(__dirname, 'test-image.jpg');

export const TEST_USER = {
  username: 'test-user2',
  email: 'test.user2@mailinator.com',
  password: 'password',
} as const;
