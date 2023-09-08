import jwt from 'jsonwebtoken';

export const signToken = (_id: string, email: string) => {
  if (!process.env.JWT_SECRET_SEED) {
    throw new Error('No hay semilla de JWT - Revisar variables de entorno');
  }

  return jwt.sign(
    // payload
    { _id, email },

    // Seed
    process.env.JWT_SECRET_SEED,

    // Options
    {
      expiresIn: '30d',
    }
  );
};

export const isValidToken = (token: string): Promise<string> => {
  console.log('Token en function: ' + token);
  if (!process.env.JWT_SECRET_SEED) {
    throw new Error('No hay semilla de JWT - Revisar variables de entorno');
  }

  if (token.length <= 10) {
    return Promise.reject('Token no válido length');
  }

  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, process.env.JWT_SECRET_SEED ?? '', (err, payload) => {
        if (err) return reject('Token no válido en Promise');

        const { _id } = payload as { _id: string };
        resolve(_id);
      });
    } catch (error) {
      console.log({ error });
      reject('Token no válido Catch');
    }
  });
};
