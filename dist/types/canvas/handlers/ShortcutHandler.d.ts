import { KeyEvent } from '../models';
import Handler from './Handler';
/**
 * Shortcut Handler Class
 *
 * @author salgum1114
 * @class ShortcutHandler
 */
declare class ShortcutHandler {
    handler: Handler;
    keyEvent: KeyEvent;
    constructor(handler: Handler);
    /**
     * Whether keydown Escape
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isEscape: (e: KeyboardEvent) => boolean | undefined;
    /**
     * Whether keydown Q
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isQ: (e: KeyboardEvent) => boolean;
    /**
     * Whether keydown W
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isW: (e: KeyboardEvent) => boolean;
    /**
     * Whether keydown Delete or Backpsace
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isDelete: (e: KeyboardEvent) => boolean | undefined;
    /**
     * Whether keydown Arrow
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isArrow: (e: KeyboardEvent) => boolean | undefined;
    /**
     * Whether keydown Ctrl + A
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isCtrlA: (e: KeyboardEvent) => boolean | undefined;
    /**
     * Whether keydown Ctrl + C
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isCtrlC: (e: KeyboardEvent) => boolean | undefined;
    /**
     * Whether keydown Ctrl + V
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isCtrlV: (e: KeyboardEvent) => boolean | undefined;
    /**
     * Whether keydown Ctrl + Z
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isCtrlZ: (e: KeyboardEvent) => boolean | undefined;
    /**
     * Whether keydown Ctrl + Y
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isCtrlY: (e: KeyboardEvent) => boolean | undefined;
    /**
     * Whether keydown Plus Or Equal
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isPlus: (e: KeyboardEvent) => boolean | undefined;
    /**
     * Whether keydown Minus
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isMinus: (e: KeyboardEvent) => boolean | undefined;
    /**
     * Whether keydown O
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isO: (e: KeyboardEvent) => boolean | undefined;
    /**
     * Whether keydown P
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isP: (e: KeyboardEvent) => boolean | undefined;
    /**
     * Whether keydown Ctrl + X
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isCtrlX: (e: KeyboardEvent) => boolean | undefined;
}
export default ShortcutHandler;
