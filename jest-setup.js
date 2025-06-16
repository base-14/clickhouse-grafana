// Jest setup provided by Grafana scaffolding
import './.config/jest-setup';

// Add TextEncoder/TextDecoder polyfill for Node.js environment
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
