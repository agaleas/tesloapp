import { User } from '@/models';
import { db } from './';
import bcrypt from 'bcryptjs';

export const checkUserEmailPassword = async (
  email: string,
  password: string
) => {
  await db.connect();
  const user = await User.findOne({ email });
  await db.disconnect();

  if (!user) {
    return null;
  }

  if (!bcrypt.compareSync(password, user.password!)) {
    console.log('Error en las credenciales');
    return null;
  }

  const { role, name, _id } = user;

  return {
    role,
    name,
    email: email.toLowerCase(),
    id: _id,
  };
};

//Esta función crea o verifica el usuario de OAuth
export const oAuthToDbUser = async (oAuthEmail: string, oAuthName: string) => {
  await db.connect();
  const user = await User.findOne({ email: oAuthEmail });
  if (user) {
    await db.disconnect();
    const { _id: id, email, name, role } = user;
    return { id, name, role, email };
  }

  const newUser = new User({
    email: oAuthEmail,
    name: oAuthName,
    password: '@',
    role: 'client',
  });

  await newUser.save();
  await db.disconnect();

  const { _id: id, email, name, role } = newUser;
  return { id, name, role, email };
};
