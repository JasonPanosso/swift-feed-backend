export const formatDataToTsv = (
  data: Array<Record<string, string>>
): string => {
  const headers = Object.keys(data[0]);
  const lines = [headers.join('\t')];

  for (const record of data) {
    const line = headers
      .map((header) => {
        let value = record[header] ?? '';
        value = value.replace(/"/g, '""');
        return `"${value}"`;
      })
      .join('\t');
    lines.push(line);
  }

  return lines.join('\n');
};
