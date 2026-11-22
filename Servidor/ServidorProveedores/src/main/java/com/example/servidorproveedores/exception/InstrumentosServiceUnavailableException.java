package com.example.servidorproveedores.exception;

public class InstrumentosServiceUnavailableException extends RuntimeException {
    public InstrumentosServiceUnavailableException(String message, Throwable cause) {
        super(message, cause);
    }

    public InstrumentosServiceUnavailableException(String message) {
        super(message);
    }
}
