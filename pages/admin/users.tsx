import { PeopleOutline } from '@mui/icons-material'
import React, { useEffect, useState } from 'react'
import { AdminLayout } from '../../components/layout'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import { Grid, MenuItem, Select } from '@mui/material'
import useSWR from 'swr'
import { IUser } from '../../interfaces'
import { tesloApi } from '../../api'




const UsersPage = () => {


    
    
    const { data, error } = useSWR<IUser[]>('/api/admin/users');
    // console.log({data});

    const [users, setUsers] = useState<IUser[]>([]);



    useEffect(() => {
      if (data){
          setUsers(data)
      }
    }, [data]);
    
    
    
    if (!data && !error) return (<></>)
    
    const onRoleUpdated = async (userId:string, newRole:string)=>{
        // console.log({userId});

        const previousUsers = users.map( user => ({...user}) );
        
        const updatedUsers = users.map( user => ({
            ...user,
            role: userId === user._id ? newRole : user.role
        }) );

        setUsers(updatedUsers);

        try {
            
            await tesloApi.put('/admin/users', {userId, role: newRole});


        } catch (error) {
            setUsers(previousUsers)
            console.log(error);
            
            alert('No se pudo actualizar el rol del usuario')
        }

    }


    
    const columns: GridColDef[] = [
        { field: 'email', headerName: 'Correo', width: 250 },
        { field: 'name', headerName: 'Nombre completp', width: 300 },
        { 
            field: 'role',
            headerName: 'Rol', 
            width: 300,
            renderCell: ({row}: GridValueGetterParams) =>{
                // console.log(row.id);
                

                return (
                    <Select
                        value={row.role}
                        label='Rol'
                        onChange={ ({ target }) => onRoleUpdated( row.id, target.value)}
                        sx={{ width: '300px' }}
                    >
                        <MenuItem value='admin'>Admin</MenuItem>
                        <MenuItem value='client'>Client</MenuItem>
                        <MenuItem value='super-user'>Super User</MenuItem>
                        <MenuItem value='CEO'>CEO</MenuItem>


                    </Select>
                )

            } 
        },
    ];


    const rows = users.map( user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    }) )



  return (
    <AdminLayout
        title="Usuarios"
        subtitle='Mantenimiento de usuarios'
        icon={<PeopleOutline />}
    >
        <Grid container className='fadeIn'>
            <Grid item xs={12} sx={{height:650, widows:'100%'}}>
                <DataGrid columns={columns} rows={rows} pageSize={10} rowsPerPageOptions={[10]} />
            </Grid>
        </Grid>

    </AdminLayout>
  )
}

export default UsersPage