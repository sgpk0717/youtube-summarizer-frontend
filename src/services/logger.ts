/**
 * 프론트엔드 로그 시스템
 * 모든 로그를 메모리에 저장하고 뷰어를 통해 확인
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  data?: any;
  location?: string;
  stackTrace?: string;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private maxLogs = 500; // 최대 저장 로그 수
  private listeners: ((logs: LogEntry[]) => void)[] = [];

  private constructor() {
    this.interceptConsole();
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  // 콘솔 메서드 가로채기
  private interceptConsole() {
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;
    const originalDebug = console.debug;

    console.log = (...args) => {
      this.log(LogLevel.INFO, this.formatArgs(args), this.getCallerInfo());
      originalLog.apply(console, args);
    };

    console.warn = (...args) => {
      this.log(LogLevel.WARN, this.formatArgs(args), this.getCallerInfo());
      originalWarn.apply(console, args);
    };

    console.error = (...args) => {
      this.log(LogLevel.ERROR, this.formatArgs(args), this.getCallerInfo());
      originalError.apply(console, args);
    };

    console.debug = (...args) => {
      this.log(LogLevel.DEBUG, this.formatArgs(args), this.getCallerInfo());
      originalDebug.apply(console, args);
    };
  }

  private formatArgs(args: any[]): string {
    return args.map(arg => {
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg, null, 2);
        } catch {
          return String(arg);
        }
      }
      return String(arg);
    }).join(' ');
  }

  private getCallerInfo(): string {
    const error = new Error();
    const stack = error.stack?.split('\n');
    if (stack && stack.length > 3) {
      const callerLine = stack[3];
      const match = callerLine.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/);
      if (match) {
        const [, func, file, line, col] = match;
        return `${func} (${file.split('/').pop()}:${line}:${col})`;
      }
    }
    return 'Unknown';
  }

  // 로그 추가
  private log(level: LogLevel, message: string, location?: string, data?: any) {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      location,
      data
    };

    // 스택 트레이스 추가 (에러인 경우)
    if (level === LogLevel.ERROR) {
      entry.stackTrace = new Error().stack;
    }

    this.logs.push(entry);

    // 최대 로그 수 유지
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // 리스너들에게 알림
    this.notifyListeners();
  }

  // 공개 로깅 메서드
  public debug(message: string, data?: any) {
    this.log(LogLevel.DEBUG, message, this.getCallerInfo(), data);
  }

  public info(message: string, data?: any) {
    this.log(LogLevel.INFO, message, this.getCallerInfo(), data);
  }

  public warn(message: string, data?: any) {
    this.log(LogLevel.WARN, message, this.getCallerInfo(), data);
  }

  public error(message: string, data?: any) {
    this.log(LogLevel.ERROR, message, this.getCallerInfo(), data);
  }

  // 함수 실행 로깅
  public logFunction(funcName: string, args?: any, result?: any) {
    const message = result !== undefined
      ? `✅ ${funcName} 완료`
      : `🚀 ${funcName} 시작`;

    const data = {
      function: funcName,
      ...(args && { arguments: args }),
      ...(result !== undefined && { result })
    };

    this.info(message, data);
  }

  // API 요청 로깅
  public logApiRequest(method: string, url: string, data?: any) {
    this.info(`📤 API 요청: ${method} ${url}`, data);
  }

  // API 응답 로깅
  public logApiResponse(method: string, url: string, status: number, data?: any) {
    const level = status >= 400 ? LogLevel.ERROR : LogLevel.INFO;
    const icon = status >= 400 ? '❌' : '📥';
    this.log(level, `${icon} API 응답: ${method} ${url} - ${status}`, this.getCallerInfo(), data);
  }

  // 로그 가져오기
  public getLogs(): LogEntry[] {
    return [...this.logs];
  }

  // 로그 클리어
  public clearLogs() {
    this.logs = [];
    this.notifyListeners();
  }

  // 로그 필터링
  public getFilteredLogs(level?: LogLevel, searchText?: string): LogEntry[] {
    let filtered = this.logs;

    if (level) {
      filtered = filtered.filter(log => log.level === level);
    }

    if (searchText) {
      const search = searchText.toLowerCase();
      filtered = filtered.filter(log =>
        log.message.toLowerCase().includes(search) ||
        (log.data && JSON.stringify(log.data).toLowerCase().includes(search))
      );
    }

    return filtered;
  }

  // 로그 내보내기 (JSON)
  public exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // 리스너 등록
  public addListener(listener: (logs: LogEntry[]) => void) {
    this.listeners.push(listener);
  }

  // 리스너 제거
  public removeListener(listener: (logs: LogEntry[]) => void) {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.logs));
  }

  // 로그 통계
  public getStats() {
    const stats = {
      total: this.logs.length,
      debug: 0,
      info: 0,
      warn: 0,
      error: 0
    };

    this.logs.forEach(log => {
      switch(log.level) {
        case LogLevel.DEBUG:
          stats.debug++;
          break;
        case LogLevel.INFO:
          stats.info++;
          break;
        case LogLevel.WARN:
          stats.warn++;
          break;
        case LogLevel.ERROR:
          stats.error++;
          break;
      }
    });

    return stats;
  }
}

// 싱글톤 인스턴스 export
export const logger = Logger.getInstance();

// 함수 로깅 데코레이터 (TypeScript용)
export function LoggedFunction(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = async function(...args: any[]) {
    logger.logFunction(`${target.constructor.name}.${propertyKey}`, args);

    try {
      const result = await originalMethod.apply(this, args);
      logger.logFunction(`${target.constructor.name}.${propertyKey}`, undefined, result);
      return result;
    } catch (error) {
      logger.error(`❌ ${target.constructor.name}.${propertyKey} 에러`, error);
      throw error;
    }
  };

  return descriptor;
}