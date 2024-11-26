import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const TypeAdModal = ({
  showModal,
  handleCloseModal,
  handleSubmit,
  handleInputChange,
  formData,
  editMode,
}) => {
  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>
          {editMode
            ? "Modifier le Type de Publicité"
            : "Ajouter un Nouveau Type de Publicité"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formTypeAdName">
            <Form.Label>Nom du Type de Publicité</Form.Label>
            <Form.Control
              type="text"
              placeholder="Entrez le nom du type de publicité"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            {editMode ? "Mettre à jour" : "Enregistrer"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default TypeAdModal;
