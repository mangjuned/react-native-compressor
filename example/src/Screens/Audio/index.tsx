import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Button from '../../Components/Button';
import Row from '../../Components/Row';
import { Audio } from 'react-native-compressor';
import DocumentPicker from 'react-native-document-picker';
import prettyBytes from 'pretty-bytes';
import { getFileInfo } from '../../Utils';

const Index = () => {
  const [fileName, setFileName] = useState('');
  const [mimeType, setMimeType] = useState('');
  const [orignalSize, setOrignalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const chooseAudioHandler = async () => {
    try {
      const res: any = await DocumentPicker.pick({
        type: [DocumentPicker.types.audio],
      });
      setOrignalSize(prettyBytes(res[0]?.size));
      setFileName(res[0].name);
      setMimeType(res[0].type);
      console.log('source file: ', res[0].uri);
      Audio.compress(res[0].uri, { quality: 'medium' })
        .then(async (outputFilePath: string) => {
          console.log(outputFilePath, 'outputFilePath compressed audio');
          const detail: any = await getFileInfo(outputFilePath);
          setCompressedSize(prettyBytes(parseInt(detail.size)));
        })
        .catch((e) => {
          console.log(e, 'error');
        });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  };

  return (
    <View style={styles.container}>
      <Row label="File Name" value={fileName} />
      <Row label="Mime Type" value={mimeType} />
      <Row label="Orignal Size" value={orignalSize} />
      <Row label="Compressed Size" value={compressedSize} />
      <Button onPress={chooseAudioHandler} title="Choose Audio" />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
