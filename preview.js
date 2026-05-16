'use strict'

import { uploadParaCloudinary } from "./cloudinary.js"

export async function uploadImagem(){
        const input = document.getElementById('preview-input')
        const linkPublico = await uploadParaCloudinary(input.files[0])
        console.log(linkPublico)

}

export function preview ({target}) {
    document.getElementById('preview-image')
            .src = URL.createObjectURL(target.files[0])
   
}

// document.getElementById('preview-input')
//         .addEventListener('change', preview)

// document.getElementById('salvar').addEventListener('click', uploadImagem)