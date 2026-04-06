
const querys = {
    getNotificationsUsers: () => {
        return `
        select u.*,
        (select account_idaccount
            from gambatte_db.account as a
            where u.account_idaccount = a.idAccount
        )as au,
        (select count(ex.idExpenses)
            from gambatte_db.expenses as ex
            where u.account_idaccount = ex.account_idaccount AND ex.state = 0
        ) as cant_expenses,
        (select sum(ex.amount)
            from gambatte_db.expenses as ex
            where u.account_idaccount = ex.account_idaccount AND ex.state = 0
        ) as total_amount_expenses,
        (select count(dep.idDeposit)
            from gambatte_db.deposit as dep
            where u.account_idaccount = dep.account_idaccount AND dep.state = 0
        ) as cant_deposits,
        (select sum(de.amount)
            from gambatte_db.deposit as de
            where u.account_idaccount = de.account_idaccount AND de.state = 0
        ) as total_amount_deposits
        from gambatte_db.user as u;`
    }
}

export { querys }