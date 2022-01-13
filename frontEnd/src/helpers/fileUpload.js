export async function getImageBlob(base64Image) {
    try {
        const base64Response = await fetch(base64Image);
        return {
            success: true,
            data: await base64Response.blob()
        };
    } catch (e) {
        return { success: false }
    }

}