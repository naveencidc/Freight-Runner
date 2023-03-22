import snakeCaseKeys from 'decamelize-keys-deep';

function snakeCaseRequestTransformer(data: any) {
  return (
    (data !== undefined &&
      data !== '' &&
      JSON.stringify(snakeCaseKeys(data))) ||
    data
  );
}

export default snakeCaseRequestTransformer;
