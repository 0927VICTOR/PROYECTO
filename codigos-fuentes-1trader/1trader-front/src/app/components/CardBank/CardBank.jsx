import React from 'react'

const CardBank = ({ classCard }) => {
    return (

        <section className={classCard}>
            <div className="delantera">
                <div className="logo-marca">
                    <img src={'/assets/images/logos/visa.png'} alt="" />
                </div>
                <img src={'/assets/images/chip-tarjeta.png'} className='chip' alt="" />
                <div className="datos">
                    <div className="grupo">
                        <label className='label'>Numero Tarjeta</label>
                        <p className='numero'>#### #### #### ####</p>
                    </div>
                    <div className="flexbox">
                        <div className="grupo">
                            <label className='label'>Nombre Tarjeta</label>
                            <p className='nombre'>Jhon Doe</p>
                        </div>
                        <div className="grupo">
                            <label className='label'>Expiración</label>
                            <p className='expiracion'><span className='month'>MM</span> / <span className='year'>AA</span></p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="trasera">
                <div className="barra-magnetica">

                </div>
                <div className="datos">
                    <div className="grupo">
                        <p className='label'>Firma</p>
                        <div className="firma">
                            <p>Carlos</p>
                        </div>
                    </div>
                    <div className="grupo ccv-div">
                        <p className="label">
                            CCV
                        </p>
                        <p className='ccv'></p>
                    </div>

                </div>
                <p className="leyenda">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam repellat quae eius in numquam illum nesciunt deleniti et iste rem esse dolor
                    mollitia temporibus a ab, ipsum fugiat enim aperiam?
                </p>
                <a href="#" className='link-banco'>www.tubanco.com</a>
            </div>
        </section>

    )
}

export default CardBank