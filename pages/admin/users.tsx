import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { Grid, MenuItem, Select, Typography } from '@mui/material';
import { PeopleOutline } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { tesloApi } from '@/apis';
import { AdminLayout } from '@/components/layouts';
import { IUser } from '@/interfaces';

const UsersPage = () => {
  const { data, error } = useSWR<IUser[]>('/api/admin/users');
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);

  if (!data && !error) {
    return <></>;
  }

  if (error) {
    console.log(error);
    return <Typography>Error al cargar la información</Typography>;
  }
  
  const onRoleUpdated = async (userId = '', newRole: '') => {
    const previousUsers = users.map((user) => ({ ...user }));
    const updatedUsers = users.map((user) => ({
      ...user,
      role: userId === user._id ? newRole : user.role,
    }));
    setUsers(updatedUsers);
    try {
      await tesloApi.put('/admin/users', { userId, role: newRole });
    } catch (error) {
      setUsers(previousUsers);
      console.log(error);
      alert('No se pudo actualizar el usuario');
    }
  };

  const columns: GridColDef[] = [
    { field: 'email', headerName: 'Correo', width: 250 },
    { field: 'name', headerName: 'Nombre Completo', width: 300 },
    {
      field: 'role',
      headerName: 'Rol',
      width: 300,
      renderCell: ({ row }: GridRenderCellParams) => {
        return (
          <Select
            value={row.role}
            label='Rol'
            onChange={({ target }) => onRoleUpdated(row.id, target.value)}
            sx={{ width: '300px' }}
          >
            <MenuItem value='admin'>Admin</MenuItem>
            <MenuItem value='SEO'>SEO</MenuItem>
            <MenuItem value='super-user'>Super User</MenuItem>
            <MenuItem value='client'>Client</MenuItem>
          </Select>
        );
      },
    },
  ];

  const rows = users!.map((user) => ({
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
  }));

  return (
    <AdminLayout
      title={'Usuarios'}
      subTitle={'Mantenimiento de usuarios'}
      icon={<PeopleOutline />}
    >
      <Grid container className='fadeIn'>
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid
            columns={columns}
            rows={rows}
            rowCount={10}
            pageSizeOptions={[10]}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default UsersPage;
