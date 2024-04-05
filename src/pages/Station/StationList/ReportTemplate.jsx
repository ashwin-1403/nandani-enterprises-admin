import {
  Document,
  Page,
  View,
  Image,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    position: "relative",
    height: "100vh",
  },
  title: {
    margin: 20,
    fontSize: 30,
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
    marginBottom: "40",
    marginTop: "50",
    color: "black",
    textDecoration: "none",
  },
  main_station: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
  },
  profile_container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "20",
  },
  profile_address: {
    display: "flex",
    flexDirection: "row",
    // alignItems: "center",
    justifyContent: "center",
    paddingLeft: "20",
    paddingRight: "20",
    width: "400",
    margin: "auto",
    marginTop: "20",
    marginBottom: "40",
  },
  profile_img: {
    width: "200px",
    height: "200px",
  },
  qrcode: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "40px",
    marginBottom: "60px",
  },
  footer: {
    display: "flex",
    position: "absolute",
    bottom: "0",
    // top:"220",
    left: "150",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "150",
    fontSize: "16",
  },
});

export default function ReportTemplate({
  managerName,
  managerNumber,
  address,
  stationName,
  drawImage,
}) {
  console.log("drawImage", drawImage);
  return (
    <Document>
      <Page style={styles.page} size="A4">
        <Text style={styles.title}>Nandani Enterprises</Text>

        <View style={styles.main_station}>
          <View style={styles.profile_container}>
            <Text>Station Name :- </Text>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>{stationName}</Text>
          </View>
        </View>

        {/* address */}
        <View style={styles.profile_address}>
          <Text style={{ textAlign: "center" }}>Address :- {address}</Text>
        </View>
        {/* qrcode */}
        <View style={styles.qrcode}>
          <Image style={styles.profile_img} src={drawImage} />
        </View>
        {/* manager information */}
        <View style={styles.main_station}>
          <View style={styles.profile_container}>
            <Text>Manager Name :- </Text>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>{managerName}</Text>
          </View>

          <View style={styles.profile_container}>
            <Text>Manager Number :- </Text>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>
              +91 {managerNumber}
            </Text>
          </View>
        </View>

        {/* footer */}

        <View style={styles.footer}>
          <Text>Developed by</Text>
          <Text style={{ fontFamily: "Helvetica-Bold", marginTop: "5" }}>
            Techvalens Software Systems Pvt.Ltd
          </Text>
        </View>
      </Page>
    </Document>
  );
}
