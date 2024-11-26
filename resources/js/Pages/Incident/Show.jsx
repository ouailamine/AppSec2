import React from "react";
import { Inertia } from "@inertiajs/inertia";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Card, ListGroup, Button } from "react-bootstrap";

const Show = ({ role, rolePermissions }) => {
  // Fonction pour gérer le clic sur le bouton de retour
  const handleBackClick = () => {
    Inertia.visit(route("roles.index")); // Utilisez la route appropriée pour retourner à la liste des rôles
  };

  return (
    <AdminAuthenticatedLayout>
      <Head title={`Détails du Rôle - ${role.name}`} />
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="mt-3">
            <Button variant="secondary" onClick={handleBackClick}>
              Retour à la liste
            </Button>
          </div>
          <div className="col-md-8">
            <Card className="shadow-sm">
              <Card.Header as="h5" className="bg-primary text-white">
                {role.name}
              </Card.Header>
              <Card.Body>
                <Card.Title>Détails du Rôle</Card.Title>
                <Card.Text>
                  Voici les permissions associées à ce rôle :
                </Card.Text>
                <ListGroup variant="flush">
                  {rolePermissions.map((permission) => (
                    <ListGroup.Item key={permission}>
                      {permission}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
              <Card.Footer className="text-muted">
                {/* Ajoutez tout contenu supplémentaire dans le pied de page si nécessaire */}
              </Card.Footer>
            </Card>
          </div>
        </div>
      </div>
    </AdminAuthenticatedLayout>
  );
};

export default Show;
