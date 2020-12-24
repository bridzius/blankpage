export const extractMetadata = (file: string) => {
    const metadataRegX = /^(-{3}(?<meta>[\s\S]*)-{3})?(?<content>[\s\S]*)$/;
    let metadata = {};
    const result = file.match(metadataRegX);
    const fileContent = result.groups.content;
    if (!!result.groups.meta) {
        const metadataValues = result.groups.meta
            .split("\n")
            .filter((v) => v !== "");
        metadata = metadataValues.reduce(
            (acc: Record<string, string>, meta: string) => {
                const property = meta.match(
                    /^(?<key>[\w\d]*):\s[\'\"]?(?<value>.*)[\'\"]$/
                );
                return { ...acc, [property.groups.key]: property.groups.value };
            },
            {}
        );
    }
    return { fileContent, metadata };
}
