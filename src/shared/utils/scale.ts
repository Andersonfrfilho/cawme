import { Dimensions, PixelRatio } from 'react-native';

const { width: W, height: H } = Dimensions.get('window');

const BASE_W = 390;
const BASE_H = 844;

const round = (n: number) => Math.round(PixelRatio.roundToNearestPixel(n));

/** Escala horizontal — larguras, ícones, espaçamentos horizontais */
export const scale = (size: number) => round((W / BASE_W) * size);

/** Escala vertical — alturas de seção, espaçamentos verticais */
export const verticalScale = (size: number) => round((H / BASE_H) * size);

/**
 * Escala moderada — fontes, padding, border radius
 * factor 0 = sem escala | factor 1 = escala linear total
 * Recomendado: 0.3 para fontes, 0.5 para componentes
 */
export const moderateScale = (size: number, factor = 0.5) =>
  round(size + (scale(size) - size) * factor);

