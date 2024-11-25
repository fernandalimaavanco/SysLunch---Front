export function base64ToFile(base64String: string | File, fileName: string) {

    if (typeof base64String === 'string' && base64String.startsWith('data:image')) {
        const base64Data = base64String.split(',')[1]

        const byteCharacters = atob(base64Data);

        const byteArrays = new Uint8Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteArrays[i] = byteCharacters.charCodeAt(i);
        }

        const blob = new Blob([byteArrays], { type: 'image/jpeg' });
        const file = new File([blob], fileName, { type: 'image/jpeg' });

        return file;
    }
}