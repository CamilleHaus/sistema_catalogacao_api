import PDFDocument from 'pdfkit';

/** Uma obra pronta para a folha: imagem já em JPEG e campos já como texto. */
export interface SheetWork {
  codigo: string;
  titulo: string;
  artistas: string;
  /** JPEG já reduzido, com largura e altura em pixels; null = sem imagem. */
  image: { data: Buffer; width: number; height: number } | null;
  /** Campos da ficha técnica, ao lado da imagem. */
  ficha: { label: string; value: string }[];
  /** Os demais campos escolhidos, agrupados por seção (Catalogação, Aquisição…). */
  sections: SheetSection[];
  /** Demais imagens da obra, em grade no fim da folha. */
  gallery: SheetImage[];
}

export interface SheetSection {
  title: string;
  fields: { label: string; value: string }[];
  /** Imagens dos registros da seção (nota fiscal, certificado…), à esquerda. */
  images: SheetImage[];
}

export interface SheetImage {
  data: Buffer;
  width: number;
  height: number;
  /** Créditos ou origem ("Assinatura — verso"), sob a imagem. */
  caption: string | null;
}

export interface SheetDocument {
  title: string;
  /** "Projeto · Cliente", no topo de cada folha. */
  context: string;
  generatedAt: string;
  works: SheetWork[];
}

const BRAND = '#6b0101';
const INK = '#1f1f1f';
const MUTED = '#6b6b6b';
const SOFT = '#f2f2f2';
const RULE = '#d9d9d9';
const MARGIN = 42;
const IMAGE_WIDTH = 250;
const IMAGE_MAX_HEIGHT = 320;
const GAP = 24;
/** Coluna das imagens de uma seção: menor que a da imagem principal. */
const SECTION_IMAGE_WIDTH = 130;
const SECTION_IMAGE_MAX_HEIGHT = 120;
const FIELD_SIZE = 10;
/** Altura do título de seção (linha, nome e respiro abaixo). */
const HEADING_HEIGHT = 30;
const FIELD_SPACING = 4;
/** Onde o texto começa numa folha de continuação, abaixo do topo dela. */
const CONTINUATION_TOP = MARGIN + 28;

/**
 * Uma folha A4 em pé por obra: identificação no topo, imagem principal à
 * esquerda com a ficha técnica ao lado e, abaixo, os demais campos em seções
 * (um por linha, nome em negrito; imagens da seção à esquerda) e a galeria.
 * Conteúdo longo continua na folha seguinte; a próxima obra começa numa nova.
 */
export function sheetsToPdf(sheet: SheetDocument): Promise<Buffer> {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: MARGIN, bottom: MARGIN + 16, left: MARGIN, right: MARGIN },
    bufferPages: true,
    autoFirstPage: false,
    info: { Title: sheet.title },
  });
  const chunks: Buffer[] = [];
  doc.on('data', (chunk: Buffer) => chunks.push(chunk));
  const done = new Promise<Buffer>((resolve) =>
    doc.on('end', () => resolve(Buffer.concat(chunks))),
  );

  for (const work of sheet.works) drawWork(doc, sheet, work);
  if (sheet.works.length === 0) {
    doc.addPage();
    doc.font('Helvetica').fontSize(11).fillColor(MUTED).text('Nenhuma obra.');
  }

  // Rodapé em todas as folhas, inclusive as de continuação.
  const range = doc.bufferedPageRange();
  for (let index = 0; index < range.count; index += 1) {
    doc.switchToPage(range.start + index);
    // Sem isso o pdfkit abre folha nova ao escrever abaixo da margem.
    doc.page.margins.bottom = 0;
    const y = doc.page.height - MARGIN + 4;
    const width = doc.page.width - MARGIN * 2;
    doc.font('Helvetica').fontSize(7).fillColor(MUTED);
    doc.text(`Gerado em ${sheet.generatedAt}`, MARGIN, y, {
      width,
      lineBreak: false,
    });
    doc.text(`Página ${index + 1} de ${range.count}`, MARGIN, y, {
      width,
      align: 'right',
      lineBreak: false,
    });
  }
  doc.end();
  return done;
}

function drawWork(
  doc: PDFKit.PDFDocument,
  sheet: SheetDocument,
  work: SheetWork,
) {
  doc.addPage();
  // Folha de continuação (campos longos) diz de qual obra é. O pdfkit lê a
  // margem de cima depois deste evento, então o texto segue abaixo do topo.
  const onContinuation = () => {
    drawContinuationHeader(doc, work);
    doc.page.margins.top = CONTINUATION_TOP;
    doc.y = CONTINUATION_TOP;
    // Só um valor maior que uma folha quebra no meio; ele segue no estilo de valor.
    doc.font('Helvetica').fontSize(10).fillColor(INK);
  };
  doc.on('pageAdded', onContinuation);
  try {
    drawFirstSheet(doc, sheet, work);
  } finally {
    doc.removeListener('pageAdded', onContinuation);
  }
}

function drawContinuationHeader(doc: PDFKit.PDFDocument, work: SheetWork) {
  doc
    .font('Helvetica')
    .fontSize(8)
    .fillColor(MUTED)
    .text(`${work.titulo} (continuação)`, MARGIN, MARGIN, {
      width: doc.page.width - MARGIN * 2 - 120,
      lineBreak: false,
      ellipsis: true,
    });
  doc
    .font('Helvetica-Bold')
    .fontSize(9)
    .fillColor(BRAND)
    .text(work.codigo, MARGIN, MARGIN, {
      width: doc.page.width - MARGIN * 2,
      align: 'right',
      lineBreak: false,
    });
  rule(doc, MARGIN + 14);
}

function drawFirstSheet(
  doc: PDFKit.PDFDocument,
  sheet: SheetDocument,
  work: SheetWork,
) {
  const left = MARGIN;
  const width = doc.page.width - MARGIN * 2;

  // Topo: contexto à esquerda, código à direita, linha fina.
  doc
    .font('Helvetica')
    .fontSize(8)
    .fillColor(MUTED)
    .text(sheet.context, left, MARGIN, {
      width: width - 120,
      lineBreak: false,
      ellipsis: true,
    });
  doc
    .font('Helvetica-Bold')
    .fontSize(9)
    .fillColor(BRAND)
    .text(work.codigo, left, MARGIN, {
      width,
      align: 'right',
      lineBreak: false,
    });
  rule(doc, MARGIN + 14);

  // Identificação.
  doc
    .font('Helvetica-Bold')
    .fontSize(15)
    .fillColor(INK)
    .text(work.titulo, left, MARGIN + 28, { width });
  if (work.artistas)
    doc
      .font('Helvetica')
      .fontSize(13)
      .fillColor(MUTED)
      .text(work.artistas, left, doc.y + 2, { width });

  // Imagem à esquerda, ficha técnica à direita.
  const top = doc.y + 18;
  const imageHeight = drawImage(doc, work, left, top);

  const fichaLeft = left + IMAGE_WIDTH + GAP;
  const fichaWidth = width - IMAGE_WIDTH - GAP;
  doc
    .font('Helvetica-Bold')
    .fontSize(8)
    .fillColor(BRAND)
    .text('FICHA TÉCNICA', fichaLeft, top, {
      width: fichaWidth,
      characterSpacing: 0.6,
    });
  let y = doc.y + 8;
  for (const field of work.ficha) {
    doc
      .font('Helvetica-Bold')
      .fontSize(8)
      .fillColor(MUTED)
      .text(field.label, fichaLeft, y, { width: fichaWidth });
    doc
      .font('Helvetica')
      .fontSize(10)
      .fillColor(field.value ? INK : MUTED)
      .text(field.value || '—', fichaLeft, doc.y + 1, { width: fichaWidth });
    y = doc.y + 8;
  }
  if (work.ficha.length === 0)
    doc
      .font('Helvetica')
      .fontSize(9)
      .fillColor(MUTED)
      .text('Nenhum campo da ficha técnica escolhido.', fichaLeft, y, {
        width: fichaWidth,
      });

  doc.y = Math.max(top + imageHeight, doc.y);
  for (const section of work.sections) drawSection(doc, section);
  if (work.gallery.length > 0) {
    // Pelo menos a primeira linha de fotos precisa caber junto do título.
    sectionHeading(
      doc,
      'Imagens',
      gridRows(doc, work.gallery, true).rows[0].height + 4,
    );
    drawImageGrid(doc, work.gallery, true);
  }
}

const limit = (doc: PDFKit.PDFDocument) =>
  doc.page.height - doc.page.margins.bottom;

/** Linha, título da seção em bordô; vai para a folha seguinte se não sobrar espaço. */
function sectionHeading(
  doc: PDFKit.PDFDocument,
  title: string,
  /** Espaço que precisa caber logo abaixo do título, para ele não ficar sozinho. */
  need = 40,
) {
  let y = doc.y + 18;
  if (y + HEADING_HEIGHT + need > limit(doc)) {
    doc.addPage();
    y = doc.y;
  } else rule(doc, y - 6);
  doc
    .font('Helvetica-Bold')
    .fontSize(8)
    .fillColor(BRAND)
    .text(title.toUpperCase(), MARGIN, y + 4, {
      width: doc.page.width - MARGIN * 2,
      characterSpacing: 0.6,
    });
  doc.y += 8;
}

/**
 * Seção com os campos dela, um por linha. Com imagens, elas ficam numa coluna
 * estreita à esquerda e os campos à direita, como na ficha técnica. Se o
 * bloco não cabe numa folha inteira, os campos vêm primeiro na largura toda e
 * as imagens depois, em grade.
 */
function drawSection(doc: PDFKit.PDFDocument, section: SheetSection) {
  if (section.images.length === 0) {
    sectionHeading(doc, section.title);
    drawFieldLines(doc, section.fields, MARGIN, doc.page.width - MARGIN * 2);
    return;
  }

  const fieldsLeft = MARGIN + SECTION_IMAGE_WIDTH + GAP;
  const fieldsWidth = doc.page.width - MARGIN - fieldsLeft;
  const fieldsHeight = section.fields.reduce(
    (sum, field) => sum + lineHeight(doc, field, fieldsWidth) + FIELD_SPACING,
    0,
  );
  const images = section.images.map((image) => {
    const scale = Math.min(
      SECTION_IMAGE_WIDTH / image.width,
      SECTION_IMAGE_MAX_HEIGHT / image.height,
    );
    return {
      image,
      width: image.width * scale,
      height: image.height * scale,
      caption: captionHeight(doc, image, SECTION_IMAGE_WIDTH),
    };
  });
  const imagesHeight = images.reduce(
    (sum, item) => sum + item.height + item.caption + 10,
    0,
  );
  const blockHeight = Math.max(fieldsHeight, imagesHeight);
  // Espaço de uma folha de continuação inteira, já descontado o título.
  const usable = limit(doc) - CONTINUATION_TOP - HEADING_HEIGHT;

  if (blockHeight > usable) {
    sectionHeading(doc, section.title);
    drawFieldLines(doc, section.fields, MARGIN, doc.page.width - MARGIN * 2);
    drawImageGrid(doc, section.images, false);
    return;
  }
  // Título e bloco andam juntos: se o bloco não cabe, os dois vão para a próxima.
  sectionHeading(doc, section.title, blockHeight);

  const top = doc.y;
  let y = top;
  for (const item of images) {
    doc.image(
      item.image.data,
      MARGIN + (SECTION_IMAGE_WIDTH - item.width) / 2,
      y,
      {
        width: item.width,
        height: item.height,
      },
    );
    if (item.image.caption)
      doc
        .font('Helvetica')
        .fontSize(7.5)
        .fillColor(MUTED)
        .text(item.image.caption, MARGIN, y + item.height + 4, {
          width: SECTION_IMAGE_WIDTH,
          align: 'center',
        });
    y += item.height + item.caption + 10;
  }
  doc.y = top;
  drawFieldLines(doc, section.fields, fieldsLeft, fieldsWidth);
  doc.y = top + blockHeight;
}

function lineHeight(
  doc: PDFKit.PDFDocument,
  field: { label: string; value: string },
  width: number,
) {
  return doc
    .font('Helvetica-Bold')
    .fontSize(FIELD_SIZE)
    .heightOfString(`${field.label}: ${field.value || '—'}`, { width });
}

function captionHeight(
  doc: PDFKit.PDFDocument,
  image: SheetImage,
  width: number,
) {
  if (!image.caption) return 0;
  return (
    doc
      .font('Helvetica')
      .fontSize(7.5)
      .heightOfString(image.caption, { width }) + 4
  );
}

/** Campos um por linha, nome em negrito; linha que não cabe vai inteira para a folha seguinte. */
function drawFieldLines(
  doc: PDFKit.PDFDocument,
  fields: { label: string; value: string }[],
  left: number,
  width: number,
) {
  for (const field of fields) {
    const value = field.value || '—';
    const height = lineHeight(doc, field, width);
    if (doc.y + height > limit(doc) && height < limit(doc) - CONTINUATION_TOP)
      doc.addPage();
    doc
      .font('Helvetica-Bold')
      .fontSize(FIELD_SIZE)
      .fillColor(INK)
      .text(`${field.label}: `, left, doc.y, { width, continued: true })
      .font('Helvetica')
      .fillColor(field.value ? INK : MUTED)
      .text(value, { width });
    doc.y += FIELD_SPACING;
  }
}

/**
 * Grade de imagens: até 3 por linha. Na galeria, com 1 ou 2 imagens elas
 * ficam maiores; nas seções, sempre pequenas. Uma linha que não cabe vai
 * inteira para a folha seguinte.
 */
const GRID_GAP = 12;

/** Linhas da grade já medidas: tamanho de cada imagem e altura da linha. */
function gridRows(
  doc: PDFKit.PDFDocument,
  images: SheetImage[],
  grow: boolean,
) {
  const width = doc.page.width - MARGIN * 2;
  const columns = grow ? Math.min(3, images.length) : 3;
  const cellWidth = (width - GRID_GAP * (columns - 1)) / columns;
  const maxHeight = !grow
    ? SECTION_IMAGE_MAX_HEIGHT
    : columns === 1
      ? 300
      : columns === 2
        ? 220
        : 160;
  const rows = [];
  for (let start = 0; start < images.length; start += columns) {
    const items = images.slice(start, start + columns).map((image) => {
      const scale = Math.min(cellWidth / image.width, maxHeight / image.height);
      return {
        image,
        width: image.width * scale,
        height: image.height * scale,
        caption: captionHeight(doc, image, cellWidth),
      };
    });
    rows.push({
      items,
      height: Math.max(...items.map((item) => item.height + item.caption)),
    });
  }
  return { rows, cellWidth };
}

function drawImageGrid(
  doc: PDFKit.PDFDocument,
  images: SheetImage[],
  grow: boolean,
) {
  const { rows, cellWidth } = gridRows(doc, images, grow);
  const gap = GRID_GAP;
  let y = doc.y + 4;
  for (const { items: row, height: rowHeight } of rows) {
    if (y + rowHeight > limit(doc)) {
      doc.addPage();
      y = doc.y;
    }
    row.forEach((item, index) => {
      const cellLeft = MARGIN + index * (cellWidth + gap);
      doc.image(item.image.data, cellLeft + (cellWidth - item.width) / 2, y, {
        width: item.width,
        height: item.height,
      });
      if (item.image.caption)
        doc
          .font('Helvetica')
          .fontSize(7.5)
          .fillColor(MUTED)
          .text(item.image.caption, cellLeft, y + item.height + 4, {
            width: cellWidth,
            align: 'center',
          });
    });
    y += rowHeight + gap;
  }
  doc.y = y;
}

/** Desenha a imagem (ou o quadro "Sem imagem") e devolve a altura usada. */
function drawImage(
  doc: PDFKit.PDFDocument,
  work: SheetWork,
  x: number,
  y: number,
) {
  if (!work.image) {
    const height = 200;
    doc.rect(x, y, IMAGE_WIDTH, height).fill(SOFT);
    doc
      .font('Helvetica')
      .fontSize(9)
      .fillColor(MUTED)
      .text('Sem imagem', x, y + height / 2 - 5, {
        width: IMAGE_WIDTH,
        align: 'center',
      });
    return height;
  }
  const scale = Math.min(
    IMAGE_WIDTH / work.image.width,
    IMAGE_MAX_HEIGHT / work.image.height,
  );
  const drawnWidth = work.image.width * scale;
  const drawnHeight = work.image.height * scale;
  // Imagem estreita fica centrada na coluna, para a ficha não "andar".
  doc.image(work.image.data, x + (IMAGE_WIDTH - drawnWidth) / 2, y, {
    width: drawnWidth,
    height: drawnHeight,
  });
  return drawnHeight;
}

function rule(doc: PDFKit.PDFDocument, y: number) {
  doc
    .moveTo(MARGIN, y)
    .lineTo(doc.page.width - MARGIN, y)
    .lineWidth(0.6)
    .strokeColor(RULE)
    .stroke();
}
