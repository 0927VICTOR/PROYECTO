import React, { useEffect } from "react";

// reactstrap components
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";

function Example({ open }: any) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const toggleModalTermAndConditions = () => {
    setModalOpen(!modalOpen);
  };

  useEffect(() => {
    setModalOpen(open);
  }, [open]);

  return (
    <>
      <Modal toggle={() => setModalOpen(!modalOpen)} isOpen={modalOpen}>
        <div className=" modal-header">
          <h5
            className=" modal-title"
            id="exampleModalLabel"
            style={{ color: "black" }}
          >
            Terminos y condiciones
          </h5>
          <button
            aria-label="Close"
            className=" close"
            type="button"
            onClick={() => setModalOpen(!modalOpen)}
          >
            <span aria-hidden={true}>×</span>
          </button>
        </div>
        <ModalBody style={{ color: "black" }}>
          <p style={{ textAlign: "justify" }}>
            La negociación de instrumentos financieros conlleva un alto nivel de
            riesgo y puede no ser adecuada para todos los inversores. Asegúrese
            de comprender los riesgos que conlleva, ya que puede perder todo el
            capital invertido. El 91% de las cuentas de inversores minoristas
            pierden dinero al operar con este proveedor. Usted debe considerar
            si usted entiende cómo funcionan los instrumentos financieros de
            comercio y si puede permitirse el lujo de asumir el alto riesgo de
            perder su dinero. Los CFD son instrumentos complejos y están
            asociados a un riesgo elevado de perder dinero rápidamente debido al
            apalancamiento.
          </p>
          <br />
          <p style={{ textAlign: "justify" }}>
            <span style={{ fontWeight: "bold" }}>1trader</span> Autorizada y
            regulada por la Autoridad de Conducta Financiera, número de registro
            475363. OPEPNASDAQ es responsable del procesamiento de pagos con
            tarjeta de los cuales el inversionista renuncia al capital invertido
            sea por medio de tarjeta o cualquier otro método de depósito.
            1Trader Corp está autorizada y regulada por la Comisión de Valores
            de las Bahamas. 1Trader Corp es una empresa internacional registrada
            en la Mancomunidad de las Bahamas, número de registro 125669 A.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button
            style={{
              backgroundColor: "rgb(236, 171, 15)",
              borderColor: "aliceblue",
            }}
            type="button"
            onClick={() => setModalOpen(!modalOpen)}
          >
            Cerrar
          </Button>
          {/* <Button color="primary" type="button">
            Save changes
          </Button> */}
        </ModalFooter>
      </Modal>
    </>
  );
}

export default Example;
