import React from 'react';

import { useCSVReader } from 'react-papaparse';

const styles = {
  csvReader: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
  },
  browseFile: {
    borderRadius: 0,
    marginLeft: 0,
    marginRight: 0,
    width: "35%",
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: 'lightblue',
  },
  acceptedFile: {
    border: '1px solid #ccc',
    height: 45,
    lineHeight: 2.5,
    paddingLeft: 10,
    width: '50%',
  },
  remove: {
    borderRadius: 0,
    padding: '0 20px',
    backgroundColor: 'lightpink',
    width: '15%',
  },
  progressBarBackgroundColor: {
    backgroundColor: 'red',
  },
};

export default function CSVReader() {
  const { CSVReader } = useCSVReader();

  return (
    <CSVReader
      onUploadAccepted={onUploadAccepted}
    >
      {({
        getRootProps,
        acceptedFile,
        ProgressBar,
        getRemoveFileProps,
      }) => (
        <>
          <div style={styles.csvReader}>
            <button type='button' {...getRootProps()} style={styles.browseFile}>
              Browse file
            </button>
            <div style={styles.acceptedFile}>
              {acceptedFile && acceptedFile.name}
            </div>
            <button {...getRemoveFileProps()} style={styles.remove}>
              Remove
            </button>
          </div>
          <ProgressBar style={styles.progressBarBackgroundColor} />
        </>
      )}
    </CSVReader>
  );
}