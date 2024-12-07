// MyDocument.js
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import logoImg from "../../../../public/assets/img/logo-atalix.png";

// Définir les styles pour le PDF
const styles = StyleSheet.create({
  body: {
    position: "relative",
    width: "100%",
    height: "100%",
    backgroundColor: "#87c4f4",
  },
  square: {
    marginRight: 3,
    width: 60,
    height: 60,
    backgroundColor: "grey",
    border: "1px solid black",
  },
  squareNumberCarte: {
    fontSize: 8,
    marginTop: 5,
    margin: 3,
    padding: 1,
    width: 150,
    height: "auto",
    textAlign: "center",
    fontWeight: "bold",
    backgroundColor: "#87c4f4",
  },
  columnContainer1: {
    display: "flex",
    flexDirection: "row",
    zIndex: 1,
  },
  column1: {
    flex: 1,
    padding: 0,
  },
  column2: {
    padding: 0,
    justifyContent: "flex-end",
  },
  columnContainer2: {
    display: "flex",
    flexDirection: "row",
    zIndex: 1,
  },
  column3: {
    marginTop: 10,
    flex: 1,
    padding: 0,
  },
  title: {
    backgroundColor: "black",
    color: "white",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 1,
    fontWeight: "bold",
  },
  span: {
    color: "#ffc451",
    fontSize: 12,
  },
  text: {
    fontSize: 9,
    margin: 5,
    textAlign: "justify",
    fontFamily: "Times-Roman",
    lineHeight: 0.2,
  },
  textt: {
    fontSize: 7,
    margin: 5,
    textAlign: "center",
    fontFamily: "Times-Roman",
    lineHeight: 1,
  },
  code: {
    fontSize: 7,
    marginTop: 10,
    margin: 5,
    textAlign: "justify",
    fontFamily: "Times-Roman",
    lineHeight: 1.5,
  },
  footerWeb: {
    color: "blue",
    textAlign: "center",
    fontFamily: "Times-Roman",
    fontWeight: "bolder",
    fontSize: 7,
  },
  image: {
    marginVertical: 3,
    marginLeft: "auto",
    marginRight: "auto",
    width: "18%",
    height: "30%",
    textAlign: "center",
    marginBottom: 0,
  },
  imagee: {
    marginLeft: "auto",
    marginRight: "auto",
    width: "70%",
    height: "40%",
    textAlign: "center",
    marginBottom: 0,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "bold",
  },
  inp: {
    textTransform: "uppercase",
  },
  backgroundImagee: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    position: "absolute",
  },
});

const MyDocument = ({ formData }) => (
  <Document>
    <Page size={[241.975, 156.925]} style={styles.pageWithBackground}>
      <View style={styles.pageContent}>
        <Text style={styles.title}>
          ATALIX SECURITE<Text style={styles.span}>.</Text>
        </Text>
        <View style={styles.row}>
          <View style={styles.columnContainer1}>
            <View style={styles.column1}>
              <Text style={styles.text}>
                Nom :<Text style={styles.inp}> {formData.fullname}</Text>{" "}
              </Text>
              <Text style={styles.text}>
                Prénom : <Text style={styles.inp}> {formData.firstname}</Text>
              </Text>
              <Text style={styles.text}>
                Né le :{" "}
                {formData.date_of_birth
                  ? new Date(formData.date_of_birth).toLocaleDateString()
                  : ""}
              </Text>
              <Text style={styles.text}>Fonction : Agent de Sécurité</Text>

              <View style={styles.row}>
                <Text style={styles.text}>Numéro carte pro:</Text>
                <Text style={styles.squareNumberCarte}>
                  CAR | {formData.professional_card_number}
                </Text>
              </View>

              <Text style={styles.code}>
                Agent de gardiennage ou de surveillance humaine{"\n"}
                pouvant inclure l'utilisation de moyens électroniques
              </Text>
            </View>
            <View style={styles.column2}>
              <View style={styles.square}>
                {formData.image && (
                  <Image
                    src={URL.createObjectURL(formData.image)}
                    style={styles.squareImage}
                  />
                )}
              </View>
              <Image style={styles.imagee} src={logoImg} />
            </View>
          </View>
        </View>
      </View>
    </Page>

    <Page size={[241.975, 156.925]} style={styles.page}>
      <View style={styles.pageContent}>
        <Image style={styles.image} src={logoImg} />
        <Text style={styles.subtitle}>
          Atalix Sécurité<Text style={styles.span}>.</Text>
        </Text>
        <Text style={styles.textt}>
          Sasu {"\n"}
          325 rue Serge {"\n"}
          Lifar 34080 Montpellier {"\n"}
          Tél : 07 67 08 86 96 {"\n"}
          N° AUT-034-2024-09-10-20202365896
        </Text>
        <Text style={styles.textt}>
          L'autorisation administrative préalable ne confère aucun caractère
          officiel à l'entreprise ou aux personnes qui en bénéficient. Elle
          n'engage en aucune manière la responsabilité des pouvoirs publics.
        </Text>

        <Text style={styles.footerWeb}>www.info@atalixsecurite.com</Text>
      </View>
    </Page>
  </Document>
);

export default MyDocument;
