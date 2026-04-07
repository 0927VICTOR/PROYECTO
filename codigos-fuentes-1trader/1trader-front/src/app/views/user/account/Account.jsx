import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Card, CardActions, CardContent, Grid, Typography, styled } from '@mui/material';
import ButtonAction from 'app/components/Button/ButtonAction';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { formatPrice } from '../../../utils/utils'
import { getAccount } from 'app/slices/userSlice/account';

// Context User
import useAuth from 'app/hooks/useAuth';

const Account = () => {

    const navigate = useNavigate();
    let { account } = useSelector((state) => state.account);
    const dispatch = useDispatch();
    const { user } = useAuth()

    useEffect(async () => {
        try {
            dispatch(getAccount(user.id))
        } catch (error) {
            console.log('Mostrando el error : ', error);
        }
    }, []);

    const handleRedirectBalanceHistory = () => {
        // navigate(`/customer/account/balance/${user.id}`)
    }

    return (
        <Grid className=' container card-account-ppal'>
            <Grid item className='card-account'>
                <Card>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div" >
                            Saldo cuenta
                        </Typography>
                        <hr />
                        <Typography gutterBottom variant="h5" component="div" marginTop={4}>
                            {account.balance === 0 ? `€ ${0}` : ` ${formatPrice(parseFloat(account.balance).toFixed(2)).replace('$', '€')}`}
                        </Typography>
                        {/* <Grid className='center-button-card'>
                            <CardActions>
                                <ButtonAction classNameButon={'button-maim'} title={'Movimientos'} size="sm" handle={handleRedirectBalanceHistory} />
                            </CardActions>
                        </Grid> */}
                    </CardContent>
                </Card>
            </Grid>
        </Grid>

    )
}


export default Account