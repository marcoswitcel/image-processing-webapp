
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

export function makeFilter5x5(
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
				iter % (imageWidth * 4) < 3 ||
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
			for (let j = -2; j <= 2; j++) {
				for (let k = -2; k <= 2; k++) {
					const factor = factorsMatrix[k + 2][j + 2];
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


export const gaussianBlur = makeFilter([
    [ 1/16, 1/8, 1/16 ],
    [ 1/8 , 1/4, 1/8  ],
    [ 1/16, 1/8, 1/16 ]
]);

/**
 * Demonstrações dos cálculos
 * @note https://dev.to/ikhwanal/gaussian-blur-4nnd
 */
export const gaussianBlur5x5 = makeFilter5x5([
    [ 0.0327, 0.0394, 0.0409, 0.0394, 0.0327, ],
    [ 0.0394, 0.0456, 0.0482, 0.0456, 0.0394, ],
    [ 0.0409, 0.0482, 0.0510, 0.0482, 0.0409, ],
	[ 0.0394, 0.0456, 0.0482, 0.0456, 0.0394, ],
	[ 0.0327, 0.0394, 0.0409, 0.0394, 0.0327, ],
]);




/**
 * @todo João, pelo que vi nesse vídeo: https://www.youtube.com/watch?v=uihBwtPIBxM
 * é necessário rodar o filtro em uma imagem em tons de cinza e seria bom usar um blur antes de aplicar o detector de bordas...
 */

/**
 * @wip terminar de validar
 * @param imageDataIn 
 * @param imageDataOut 
 */
export const edgeDetection: FilterProcessor = (imageDataIn: ImageData, imageDataOut: ImageData) => {
	const factorsMatrix1: number[][] = [
		[-1, 0, 1],
		[-2, 0, 2],
		[-1, 0, 1]
	];

	const factorsMatrix2: number[][] = [
		[1, 2, 1],
		[0, 0, 0],
		[-1, -2, -1]
	];


	const bufferIn = imageDataIn.data;
	const bufferOut = imageDataOut.data;
	const imageWidth = imageDataIn.width;
	const bufferLenght = bufferIn.length;

	for (let i = 0, iter = 0; i < bufferLenght; i += 4) {
		iter = i + 1;
		// borda preta
		if (
			iter < imageWidth * 4 ||
			iter > bufferLenght - imageWidth * 4 ||
			iter % (imageWidth * 4) < 2 ||
			iter % (imageWidth * 4) > imageWidth * 4 - 4
		) {
			bufferOut[i + 0] = 0;
			bufferOut[i + 1] = 0;
			bufferOut[i + 2] = 0;
			bufferOut[i + 3] = 255;
			continue;
		}


		const channel = 1; // red 0 green 1 blue 2
		let sumR = 0;
		for (let j = -1; j < 2; j++) {
			for (let k = -1; k < 2; k++) {
				const factor = factorsMatrix1[k + 1][j + 1];
				const index = i + j * 4 + k * imageWidth * 4;
				sumR += bufferIn[index + channel] * factor;
				
			}
		}


		let sumR2 = 0;
		
		for (let j = -1; j < 2; j++) {
			for (let k = -1; k < 2; k++) {
				const factor = factorsMatrix2[k + 1][j + 1];
				const index = i + j * 4 + k * imageWidth * 4;
				sumR2 += bufferIn[index + channel] * factor;
		
			}
		}

		const result = Math.sqrt(sumR * sumR + sumR2 * sumR2);

		bufferOut[i + 0] = result; // R value
		bufferOut[i + 1] = result; // G value
		bufferOut[i + 2] = result; // B value
		bufferOut[i + 3] = 255; // A value
	}
	
}

export const edgeDetectionWithGaussianBlur: FilterProcessor = (imageDataIn: ImageData, imageDataOut: ImageData) => {
	const imageDataOutTemp = new ImageData(imageDataIn.width, imageDataIn.height);
	gaussianBlur(imageDataIn, imageDataOutTemp);
	edgeDetection(imageDataOutTemp, imageDataOut);
}
