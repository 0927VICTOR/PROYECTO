import React, { useEffect, useState } from 'react'
import { ModalUtils } from '../Modal/ModalUtil'

const TermAndConditions = ({ open }) => {
    const [modalTermAndConditions, setModalTermAndConditions] = useState(false);
    const toggleModalTermAndConditions = () => {
        setModalTermAndConditions(!modalTermAndConditions);
    }

    useEffect(() => {
        setModalTermAndConditions(open)
    }, [open])

    return (
        <div>
            <ModalUtils
                title={'Terminos y condiciones'}
                open={modalTermAndConditions}
                toggle={toggleModalTermAndConditions}
                handleChange={toggleModalTermAndConditions}
                visivilityModalFooter={true}
            >
                <p style={{ textAlign: 'justify' }}>La negociación de instrumentos financieros conlleva un alto nivel de riesgo y puede no ser adecuada para todos los inversores. Asegúrese de comprender los riesgos que
                    conlleva, ya que puede perder todo el capital invertido. El 91% de las cuentas de inversores minoristas pierden dinero al operar con este proveedor. Usted debe
                    considerar si usted entiende cómo funcionan los instrumentos financieros de comercio y si puede permitirse el lujo de asumir el alto riesgo de perder su dinero.
                    Los CFD son instrumentos complejos y están asociados a un riesgo elevado de perder dinero rápidamente debido al apalancamiento.
                </p>
                <br />
                <p style={{ textAlign: 'justify' }}>
                    <span style={{ fontWeight: 'bold' }} >1trader</span> Autorizada y regulada por la Autoridad de Conducta Financiera, número de registro 475363. OPEPNASDAQ es responsable del procesamiento de pagos con tarjeta de los
                    cuales el inversionista renuncia al capital invertido sea por medio de tarjeta o cualquier otro método de depósito. 1Trader Corp está autorizada
                    y regulada por la Comisión de Valores de las Bahamas. 1Trader Corp es una empresa internacional registrada en la Mancomunidad de las Bahamas, número de registro 125669 A.
                </p>
            </ModalUtils>
        </div>
    )
}


export default TermAndConditions
