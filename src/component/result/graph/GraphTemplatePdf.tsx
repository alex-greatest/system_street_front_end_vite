import {Document, Image, Page, Text, View, StyleSheet, Font} from "@react-pdf/renderer";
import {observer} from "mobx-react-lite";

Font.register({
    family: "Roboto",
    src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf"
});

// Create style with font-family
const styles = StyleSheet.create({
    page: {
        fontFamily: "Roboto"
    },
    section: {
        fontFamily: "Roboto",
        fontSize: "25px",
        margin: "30px 0",
        padding: "10px 15px"
    },
    title: {
        marginTop: '20px',
        marginBottom: "15px",
        fontSize: "27px",
        fontFamily: "Roboto",
        textAlign: "center"
    },
    image: {
        padding: "10px 15px"
    }
});

export const GraphPdf = observer((props: {
    idHtmlGraphEffort: string,
    idHtmlGraphMoment: string,
    idHtmlTableMoment: string,
    partName: string,
    modeDescription: string,
    date: Date,
    status: string
}) => {
    const {
        idHtmlGraphEffort,
        idHtmlGraphMoment,
        idHtmlTableMoment,
        partName,
        modeDescription,
        date,
        status} = props

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.title}>
                    <Text>Код механизма: {partName}</Text>
                </View>
                <View style={styles.title}>
                    <Text>Модель: {modeDescription}</Text>
                </View>
                <View style={styles.title}>
                    <Text>Дата: {date.toString()}</Text>
                </View>
                <View style={styles.title}>
                    <Text>Результат: {status}</Text>
                </View>
                <View style={styles.section}>
                    <Text>График усилия</Text>
                </View>
                {idHtmlGraphEffort &&
                    <View>
                        <Image style={styles.image}  src={idHtmlGraphEffort}/>
                    </View>
                }
            </Page>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text>Данные параметров распределителя ГУР</Text>
                </View>
                {idHtmlGraphMoment &&
                    <View>
                        <Image style={styles.image}  src={idHtmlGraphMoment}/>
                    </View>
                }
                {idHtmlTableMoment &&
                    <View>
                        <Image style={styles.image} src={idHtmlTableMoment}/>
                    </View>
                }
            </Page>
        </Document>);
});