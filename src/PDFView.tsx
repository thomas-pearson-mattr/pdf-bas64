/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Button, StyleSheet, Text, View} from 'react-native';
import {LARGE_PDF} from './pdfs/large-base64';
import {SMALL_PDF} from './pdfs/small-base64';
import {Durations, rawPerformance} from './store';
import { sharePdfFile } from './share';
import { StatView } from './StatView';
import { ShareOpenResult } from 'react-native-share/lib/typescript/src/types';

const PDFButton = (props: {
  setContent: React.Dispatch<React.SetStateAction<PDFContext | null | undefined>>,
  name: string,
  size: string,
  base64: string,
}) => {
  const {name, size, base64, setContent} = props;

  return (
      <Button
        onPress={() => setContent({ name, size, base64 })}
        title={`Share ${name} PDF (${size})`}
        color="#841584"
        accessibilityLabel={`Share a ${name} PDF`}
      />
  );
};

type PDFContext = {
  name: string;
  size: string;
  base64: string;
}

export const PDFView = () => {
  const [selectedPdf, setSelectedPdf] = useState<PDFContext | null>();
  const [durations, setDurations] = useState<Durations[]>([]);
  const [shareResult, setShareResult] = useState<ShareOpenResult | null>(null);

  useEffect(() => {
    if (!selectedPdf) {
      return;
    }

    // Because you aren't supposed have async 'useEffect' block 😢
    const load = async () => {
      // Here basic example of what sharing implementation would be.
      const result = await sharePdfFile(selectedPdf.base64);
      setShareResult(result);

      // Separate raw call for performance stats
      const duration = await rawPerformance(selectedPdf.base64);
      setDurations((durations) => [...durations, duration]);
      setSelectedPdf(null);
    };

    load();
  }, [selectedPdf]);


  return (
    <View style={style.view}>
      {selectedPdf && <ActivityIndicator size="large" />}

      <PDFButton
        name="Small"
        size="323KB"
        base64={SMALL_PDF}
        setContent={setSelectedPdf}
      />

      <PDFButton
        name="Large"
        size="1.5MB"
        base64={LARGE_PDF}
        setContent={setSelectedPdf}
      />

      <SharedResultText
        visible={!selectedPdf}
        shareResult={shareResult}
      />

      <StatView durations={durations} setDurations={setDurations} />
    </View>
  );
};

const SharedResultText = (
  props: {
    visible: boolean;
    shareResult: ShareOpenResult | null;
  }
) => {
  const { visible, shareResult } = props;

  if (!shareResult || !visible) {
    return null;
  }

  return (
    <>
      <Text style={style.header}>
        Shared Results
      </Text>
      <Text
        style={{
          ...style.text,
          color: shareResult.success ? 'green' : 'red',
          minHeight: 40,
        }}>
        {shareResult.message}
      </Text>
    </>
  );
}

const style = StyleSheet.create({
  view: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  header: {
    textAlign: 'center',
    fontSize: 25,
    paddingTop: 10,
    paddingBottom: 10,
    fontWeight: 'bold',
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
  },
});
