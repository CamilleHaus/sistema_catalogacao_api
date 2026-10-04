"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sheetsToPdf = sheetsToPdf;
const pdfkit_1 = __importDefault(require("pdfkit"));
const BRAND = '#6b0101';
const INK = '#1f1f1f';
const MUTED = '#6b6b6b';
const SOFT = '#f2f2f2';
const RULE = '#d9d9d9';
const MARGIN = 42;
const IMAGE_WIDTH = 250;
const IMAGE_MAX_HEIGHT = 320;
const GAP = 24;
const SECTION_IMAGE_WIDTH = 130;
const SECTION_IMAGE_MAX_HEIGHT = 120;
const FIELD_SIZE = 10;
const HEADING_HEIGHT = 30;
const FIELD_SPACING = 4;
const CONTINUATION_TOP = MARGIN + 28;
function sheetsToPdf(sheet) {
    const doc = new pdfkit_1.default({
        size: 'A4',
        margins: { top: MARGIN, bottom: MARGIN + 16, left: MARGIN, right: MARGIN },
        bufferPages: true,
        autoFirstPage: false,
        info: { Title: sheet.title },
    });
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    const done = new Promise((resolve) => doc.on('end', () => resolve(Buffer.concat(chunks))));
    for (const work of sheet.works)
        drawWork(doc, sheet, work);
    if (sheet.works.length === 0) {
        doc.addPage();
        doc.font('Helvetica').fontSize(11).fillColor(MUTED).text('Nenhuma obra.');
    }
    const range = doc.bufferedPageRange();
    for (let index = 0; index < range.count; index += 1) {
        doc.switchToPage(range.start + index);
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
function drawWork(doc, sheet, work) {
    doc.addPage();
    const onContinuation = () => {
        drawContinuationHeader(doc, work);
        doc.page.margins.top = CONTINUATION_TOP;
        doc.y = CONTINUATION_TOP;
        doc.font('Helvetica').fontSize(10).fillColor(INK);
    };
    doc.on('pageAdded', onContinuation);
    try {
        drawFirstSheet(doc, sheet, work);
    }
    finally {
        doc.removeListener('pageAdded', onContinuation);
    }
}
function drawContinuationHeader(doc, work) {
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
function drawFirstSheet(doc, sheet, work) {
    const left = MARGIN;
    const width = doc.page.width - MARGIN * 2;
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
    for (const section of work.sections)
        drawSection(doc, section);
    if (work.gallery.length > 0) {
        sectionHeading(doc, 'Imagens', gridRows(doc, work.gallery, true).rows[0].height + 4);
        drawImageGrid(doc, work.gallery, true);
    }
}
const limit = (doc) => doc.page.height - doc.page.margins.bottom;
function sectionHeading(doc, title, need = 40) {
    let y = doc.y + 18;
    if (y + HEADING_HEIGHT + need > limit(doc)) {
        doc.addPage();
        y = doc.y;
    }
    else
        rule(doc, y - 6);
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
function drawSection(doc, section) {
    if (section.images.length === 0) {
        sectionHeading(doc, section.title);
        drawFieldLines(doc, section.fields, MARGIN, doc.page.width - MARGIN * 2);
        return;
    }
    const fieldsLeft = MARGIN + SECTION_IMAGE_WIDTH + GAP;
    const fieldsWidth = doc.page.width - MARGIN - fieldsLeft;
    const fieldsHeight = section.fields.reduce((sum, field) => sum + lineHeight(doc, field, fieldsWidth) + FIELD_SPACING, 0);
    const images = section.images.map((image) => {
        const scale = Math.min(SECTION_IMAGE_WIDTH / image.width, SECTION_IMAGE_MAX_HEIGHT / image.height);
        return {
            image,
            width: image.width * scale,
            height: image.height * scale,
            caption: captionHeight(doc, image, SECTION_IMAGE_WIDTH),
        };
    });
    const imagesHeight = images.reduce((sum, item) => sum + item.height + item.caption + 10, 0);
    const blockHeight = Math.max(fieldsHeight, imagesHeight);
    const usable = limit(doc) - CONTINUATION_TOP - HEADING_HEIGHT;
    if (blockHeight > usable) {
        sectionHeading(doc, section.title);
        drawFieldLines(doc, section.fields, MARGIN, doc.page.width - MARGIN * 2);
        drawImageGrid(doc, section.images, false);
        return;
    }
    sectionHeading(doc, section.title, blockHeight);
    const top = doc.y;
    let y = top;
    for (const item of images) {
        doc.image(item.image.data, MARGIN + (SECTION_IMAGE_WIDTH - item.width) / 2, y, {
            width: item.width,
            height: item.height,
        });
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
function lineHeight(doc, field, width) {
    return doc
        .font('Helvetica-Bold')
        .fontSize(FIELD_SIZE)
        .heightOfString(`${field.label}: ${field.value || '—'}`, { width });
}
function captionHeight(doc, image, width) {
    if (!image.caption)
        return 0;
    return (doc
        .font('Helvetica')
        .fontSize(7.5)
        .heightOfString(image.caption, { width }) + 4);
}
function drawFieldLines(doc, fields, left, width) {
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
const GRID_GAP = 12;
function gridRows(doc, images, grow) {
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
function drawImageGrid(doc, images, grow) {
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
function drawImage(doc, work, x, y) {
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
    const scale = Math.min(IMAGE_WIDTH / work.image.width, IMAGE_MAX_HEIGHT / work.image.height);
    const drawnWidth = work.image.width * scale;
    const drawnHeight = work.image.height * scale;
    doc.image(work.image.data, x + (IMAGE_WIDTH - drawnWidth) / 2, y, {
        width: drawnWidth,
        height: drawnHeight,
    });
    return drawnHeight;
}
function rule(doc, y) {
    doc
        .moveTo(MARGIN, y)
        .lineTo(doc.page.width - MARGIN, y)
        .lineWidth(0.6)
        .strokeColor(RULE)
        .stroke();
}
//# sourceMappingURL=sheet.js.map