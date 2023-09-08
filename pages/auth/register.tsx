import { useState, useContext } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { useForm } from 'react-hook-form';
import { signIn, getSession } from 'next-auth/react';
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { AuthLayout } from '@/components/layouts';
import { tesloApi } from '@/apis';
import { validations } from '@/utils';
import { ErrorOutline } from '@mui/icons-material';
import { AuthContext } from '@/context';
import { authOptions } from '../api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';

type formData = {
  name: string;
  email: string;
  password: string;
};

const RegisterPage = () => {
  const router = useRouter();
  const { registerUser } = useContext(AuthContext);
  const [showError, setShowError] = useState(false);
  const [isRegisteringUser, setIsRegisteringUser] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formData>();

  const onRegisterForm = async ({ name, email, password }: formData) => {
    setIsRegisteringUser(true);
    setShowError(false);

    const resp = await registerUser(name, email, password);

    if (resp.hasError) {
      setShowError(true);
      setErrorMessage(resp.message!);
      setTimeout(() => {
        setShowError(false);
      }, 2500);
      setIsRegisteringUser(false);
      return;
    }

    // const destination = router.query.p?.toString() ?? '';
    // router.replace(destination);
    await signIn('credentials', { email, password });
  };

  return (
    <AuthLayout title={'Ingresar'}>
      <form onSubmit={handleSubmit(onRegisterForm)} noValidate>
        <Box sx={{ width: 350, padding: '10px 20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='h1' component='h1'>
                Crear Usuario
              </Typography>
              <Chip
                label='Error al registrar usuario'
                color='error'
                icon={<ErrorOutline />}
                className='fadeIn'
                sx={{ display: showError ? 'flex' : 'none' }}
                variant='filled'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Nombre Completo'
                variant='outlined'
                fullWidth
                {...register('name', {
                  required: 'nombre requerido',
                  minLength: {
                    value: 2,
                    message: 'debe contener al menos 2 caracteres',
                  },
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Correo'
                variant='outlined'
                fullWidth
                {...register('email', {
                  required: 'email requerido',
                  validate: validations.isEmail,
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                type='email'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Contraseña'
                variant='outlined'
                fullWidth
                {...register('password', {
                  required: 'contraseña requerida',
                  minLength: {
                    value: 6,
                    message: 'debe contener al menos 6 caracteres',
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                type='password'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Confirmar contraseña'
                variant='outlined'
                fullWidth
                {...register('password', {
                  required: 'contraseña requerida',
                  minLength: {
                    value: 6,
                    message: 'debe contener al menos 6 caracteres',
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                type='password'
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                color='secondary'
                size='large'
                fullWidth
                className='circular-btn'
                type='submit'
                disabled={isRegisteringUser}
              >
                Crear cuenta
              </Button>
            </Grid>
            <Grid item xs={12} display='flex' justifyContent='end'>
              <NextLink
                href={
                  router.query.p
                    ? `/auth/login?p=${router.query.p?.toString()}`
                    : '/auth/login'
                }
                passHref
                legacyBehavior
              >
                <Link underline='always' color='secondary' marginTop={2}>
                  ¿Ya tienes cuenta? Inicia Sesión
                </Link>
              </NextLink>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const session = await getServerSession(req, res, authOptions);

  const { p = '/' } = query;
  if (session) {
    return {
      redirect: {
        destination: p.toString(),
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default RegisterPage;
