
export type FilterProcessor = (imageDataIn: ImageData, imageDataOut: ImageData) => void; 

/**
 * Monta filtros baseados em uma matriz de pesos (convolution kernel)
 * @param convolutionKernel
 * @returns função de filtro
 */
export function makeFilter(
	convolutionKernel: number[][]
): FilterProcessor {
	const factorsMatrix = convolutionKernel;

	/**
	 * @param imageDataIn
	 * @param imageDataOut
	 * @return
	 */
	return function filter(imageDataIn: ImageData, imageDataOut: ImageData): void {
		const bufferIn = imageDataIn.data;
		const bufferOut = imageDataOut.data;
		const imageWidth = imageDataIn.width;
		const bufferLenght = bufferIn.length;

		for (let i = 0, iter = 0; i < bufferLenght; i += 4) {
			iter = i + 1;
			// borda azul
			if (
				iter < imageWidth * 4 ||
				iter > bufferLenght - imageWidth * 4 ||
				iter % (imageWidth * 4) < 2 ||
				iter % (imageWidth * 4) > imageWidth * 4 - 4
			) {
				bufferOut[i + 0] = 0;
				bufferOut[i + 1] = 0;
				bufferOut[i + 2] = 255;
				bufferOut[i + 3] = 255;
				continue;
			}

			let sumR = 0;
			let sumG = 0;
			let sumB = 0;
			for (let j = -1; j < 2; j++) {
				for (let k = -1; k < 2; k++) {
					const factor = factorsMatrix[k + 1][j + 1];
					const index = i + j * 4 + k * imageWidth * 4;
					sumR += bufferIn[index + 0] * factor;
					sumG += bufferIn[index + 1] * factor;
					sumB += bufferIn[index + 2] * factor;
				}
			}

			bufferOut[i + 0] = sumR; // R value
			bufferOut[i + 1] = sumG; // G value
			bufferOut[i + 2] = sumB; // B value
			bufferOut[i + 3] = 255; // A value
		}
	};
}

/**
 * @todo João, pelo que vi nesse vídeo: https://www.youtube.com/watch?v=uihBwtPIBxM
 * é necessário rodar o filtro em uma imagem em tons de cinza e seria bom usar um blur antes de aplicar o detector de bordas...
 */

export const filterEdgeDetection = makeFilter([
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1]
]);
