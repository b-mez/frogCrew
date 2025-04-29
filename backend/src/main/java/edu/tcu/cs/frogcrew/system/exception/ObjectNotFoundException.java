package main.java.edu.tcu.cs.frogcrew.system.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ObjectNotFoundException extends RuntimeException {

    public ObjectNotFoundException(String objectName, Integer id) {
        super("Could not find " + objectName + " with Id " + id);
    }

    public ObjectNotFoundException(String objectName, String property) {
        super("Could not find " + objectName + " with this property: " + property);
    }

    public ObjectNotFoundException(String message) {
        super(message);
    }

}