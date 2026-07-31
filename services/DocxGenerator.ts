import {
    Document,
    Packer,
    Paragraph,
    HeadingLevel,
    TextRun,
} from "docx";

interface GenerateProjectDocumentProps {
    title: string;
    json: any;
}

function convertNodes(nodes: any[] = []): Paragraph[] {
    const paragraphs: Paragraph[] = [];

    nodes.forEach((node) => {
        paragraphs.push(...convertNode(node));
    });

    return paragraphs;
}

function convertNode(node: any): Paragraph[] {
    switch (node.type) {
        case "heading":
            return [convertHeading(node)];

        case "paragraph":
            return [convertParagraph(node)];

        case "bulletList":
            return convertBulletList(node);

        case "orderedList":
            return convertOrderedList(node);

        default:
            return [];
    }
}

function convertHeading(node: any): Paragraph {
    const level = node.attrs?.level ?? 1;

    return new Paragraph({
        heading:
            level === 1
                ? HeadingLevel.HEADING_1
                : level === 2
                    ? HeadingLevel.HEADING_2
                    : level === 3
                        ? HeadingLevel.HEADING_3
                        : HeadingLevel.HEADING_4,
        children: convertTextRuns(node.content),
    });
}

function convertParagraph(node: any): Paragraph {
    return new Paragraph({
        children: convertTextRuns(node.content),
    });
}

function convertBulletList(node: any): Paragraph[] {
    const paragraphs: Paragraph[] = [];

    node.content?.forEach((item: any) => {
        const paragraph = item.content?.find((c: any) => c.type === "paragraph");

        if (paragraph) {
            paragraphs.push(
                new Paragraph({
                    bullet: {
                        level: 0,
                    },
                    children: convertTextRuns(paragraph.content),
                })
            );
        }
    });

    return paragraphs;
}

function convertOrderedList(node: any): Paragraph[] {
    const paragraphs: Paragraph[] = [];

    node.content?.forEach((item: any) => {
        const paragraph = item.content?.find((c: any) => c.type === "paragraph");

        if (paragraph) {
            paragraphs.push(
                new Paragraph({
                    numbering: {
                        reference: "default-numbering",
                        level: 0,
                    },
                    children: convertTextRuns(paragraph.content),
                })
            );
        }
    });

    return paragraphs;
}

function convertTextRuns(content: any[] = []): TextRun[] {
    return content.map((item) => {
        const marks = item.marks ?? [];

        return new TextRun({
            text: item.text ?? "",
            bold: marks.some((m: any) => m.type === "bold"),
            italics: marks.some((m: any) => m.type === "italic"),
            underline: marks.some((m: any) => m.type === "underline")
                ? {}
                : undefined,
        });
    });
}

export async function generateProjectDocument({
    title,
    json,
}: GenerateProjectDocumentProps): Promise<File> {

    const paragraphs: Paragraph[] = [];

    // paragraphs.push(
    //     new Paragraph({
    //         text: title,
    //         heading: HeadingLevel.TITLE,
    //     })
    // );

    paragraphs.push(new Paragraph(""));

    if (json?.content) {
        paragraphs.push(...convertNodes(json.content));
    }

    const document = new Document({
        numbering: {
            config: [
                {
                    reference: "default-numbering",
                    levels: [
                        {
                            level: 0,
                            format: "decimal",
                            text: "%1.",
                            alignment: "left",
                        },
                    ],
                },
            ],
        },
        sections: [
            {
                children: paragraphs,
            },
        ],
    });

    const blob = await Packer.toBlob(document);

    return new File([blob], `${title}.docx`, {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
}