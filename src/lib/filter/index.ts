export type FilterProcessor = (imageDataIn: ImageData, imageDataOut: ImageData) => void;
export type TemporalFilterProcessor = (imageDataIn: ImageData[], imageDataOut: ImageData) => void;

/**
 * Monta filtros baseados em uma matriz de pesos (convolution kernel)
 * @param convolutionKernel
 * @returns função de filtro
 */
export function makeFilter(convolutionKernel: number[][]): FilterProcessor {
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

export function makeFilter5x5(convolutionKernel: number[][]): FilterProcessor {
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
	[1 / 16, 1 / 8, 1 / 16],
	[1 / 8, 1 / 4, 1 / 8],
	[1 / 16, 1 / 8, 1 / 16]
]);

/**
 * Demonstrações dos cálculos
 * @note https://dev.to/ikhwanal/gaussian-blur-4nnd
 */
export const gaussianBlur5x5 = makeFilter5x5([
	[0.0327, 0.0394, 0.0409, 0.0394, 0.0327],
	[0.0394, 0.0456, 0.0482, 0.0456, 0.0394],
	[0.0409, 0.0482, 0.051, 0.0482, 0.0409],
	[0.0394, 0.0456, 0.0482, 0.0456, 0.0394],
	[0.0327, 0.0394, 0.0409, 0.0394, 0.0327]
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

		// @todo João, considerar como integrar o "luma gray scale" aqui...
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
};

export const edgeDetectionWithGaussianBlur: FilterProcessor = (
	imageDataIn: ImageData,
	imageDataOut: ImageData
) => {
	const imageDataOutTemp = new ImageData(imageDataIn.width, imageDataIn.height);
	gaussianBlur(imageDataIn, imageDataOutTemp);
	edgeDetection(imageDataOutTemp, imageDataOut);
};

export const invertFilter: FilterProcessor = (imageDataIn: ImageData, imageDataOut: ImageData) => {
	const bufferIn = imageDataIn.data;
	const bufferOut = imageDataOut.data;

	const bufferLenght = bufferIn.length;

	// @todo João, implementar o blending para as linhas pretas ficarem por cima da foto
	for (let i = 0; i < bufferLenght; i += 4) {
		bufferOut[i + 0] = bufferIn[i + 0] * -1 + 255; // R value
		bufferOut[i + 1] = bufferIn[i + 1] * -1 + 255; // G value
		bufferOut[i + 2] = bufferIn[i + 2] * -1 + 255; // B value
		bufferOut[i + 3] = 255; // A value
	}
};

export const grayScale: FilterProcessor = (imageDataIn: ImageData, imageDataOut: ImageData) => {
	const bufferIn = imageDataIn.data;
	const bufferOut = imageDataOut.data;

	const bufferLenght = bufferIn.length;

	for (let i = 0; i < bufferLenght; i += 4) {
		const green = bufferIn[i + 1]; // green

		bufferOut[i + 0] = green; // R value
		bufferOut[i + 1] = green; // G value
		bufferOut[i + 2] = green; // B value
		bufferOut[i + 3] = 255; // A value
	}
};

export const luminanceGrayScale: FilterProcessor = (
	imageDataIn: ImageData,
	imageDataOut: ImageData
) => {
	const bufferIn = imageDataIn.data;
	const bufferOut = imageDataOut.data;

	const bufferLenght = bufferIn.length;

	for (let i = 0; i < bufferLenght; i += 4) {
		const color = bufferIn[i + 0] * 0.299 + bufferIn[i + 1] * 0.587 + bufferIn[i + 2] * 0.114;

		bufferOut[i + 0] = color; // R value
		bufferOut[i + 1] = color; // G value
		bufferOut[i + 2] = color; // B value
		bufferOut[i + 3] = 255; // A value
	}
};

const makeFilterOutOfChain = (chain: FilterProcessor[]): FilterProcessor => {
	return (imageDataIn: ImageData, imageDataOut: ImageData) => {
		let tempImageDataIn = new ImageData(
			new Uint8ClampedArray(imageDataIn.data),
			imageDataIn.width,
			imageDataIn.height
		);
		let tempImageDataOut = new ImageData(imageDataIn.width, imageDataIn.height);

		for (let i = 0; i < chain.length; i++) {
			const filter = chain[i];
			filter(tempImageDataIn, i === chain.length - 1 ? imageDataOut : tempImageDataOut);
			// swap
			[tempImageDataIn, tempImageDataOut] = [tempImageDataOut, tempImageDataIn];
		}
	};
};

/**
 * @todo João, integrar e testar
 * @param frames
 * @param imageDataOut
 */
export const temporalDenoising: TemporalFilterProcessor = (
	frames: ImageData[],
	imageDataOut: ImageData
) => {
	const numberOfFrames = frames.length;
	const bufferOut = imageDataOut.data;
	const tempOutput = new Float64Array(bufferOut.length);
	// no mínimo um frame deve existir
	const bufferLenght = frames[0].data.length;

	for (const frame of frames) {
		const bufferIn = frame.data;
		const bufferLenght = bufferIn.length;

		for (let i = 0; i < bufferLenght; i += 4) {
			tempOutput[i + 0] += bufferIn[i + 0]; // R value
			tempOutput[i + 1] += bufferIn[i + 1]; // G value
			tempOutput[i + 2] += bufferIn[i + 2]; // B value
			// pula alfa
		}
	}

	// clamping e divisão
	for (let i = 0; i < bufferLenght; i += 4) {
		bufferOut[i + 0] = tempOutput[i + 0] / numberOfFrames; // R value
		bufferOut[i + 1] = tempOutput[i + 1] / numberOfFrames; // G value
		bufferOut[i + 2] = tempOutput[i + 2] / numberOfFrames; // B value
		bufferOut[i + 3] = 255; // A value
	}
};

export const combinationTestFilter = makeFilterOutOfChain([edgeDetection, invertFilter]);
