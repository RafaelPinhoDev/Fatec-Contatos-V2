'use strict'

import { uploadParaCloudinary } from "./cloudinary.js"

export async function uploadImagem(){
        const inputImagem = document.getElementById('preview-input')

        if (inputImagem.files.length === 0) return ""


        const linkPublico = await uploadParaCloudinary(inputImagem.files[0])

        return linkPublico

}

export function preview ({target}) {
    document.getElementById('preview-image')
            .src = URL.createObjectURL(target.files[0])
   
}

document.getElementById('preview-input')
        .addEventListener('change', preview)