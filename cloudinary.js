
// Variáveis para conectar com o servidor storage
const CLOUD_NAME = 'dk9rnbtrp'
const PRESET_NAME = 'fotos_contato'

export async function uploadParaCloudinary(file) {
    // Formato semelhante ao Json
    const data = new FormData()

    data.append('file', file)
    data.append('upload_preset', PRESET_NAME )

    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

    const options = {
        method: 'POST',
        body: data
    }

    const response =  await fetch(url, options)

    const link = await response.json()

    return link.secure_url
    
}