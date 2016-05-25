package edu.stetson.forms.Student;

import javax.validation.constraints.NotNull;
import org.hibernate.validator.constraints.NotBlank;
import org.hibernate.validator.constraints.Email;

public class Student{
   @NotBlank
   String firstName;

   @NotBlank
   String lastName;

   @NotBlank
   String studentID;

   @NotNull
   Boolean isActive;

   public StringgetFirstName() 
   {
      return this.firstName;
   }
   public StringgetLastName() 
   {
      return this.lastName;
   }
   public StringgetStudentID() 
   {
      return this.studentID;
   }
   public BooleangetIsActive() 
   {
      return this.isActive;
   }

   public String setFirstName(String arg) 
   {
      this.firstName = arg;
   }
   public String setLastName(String arg) 
   {
      this.lastName = arg;
   }
   public String setStudentID(String arg) 
   {
      this.studentID = arg;
   }
   public Boolean setIsActive(Boolean arg) 
   {
      this.isActive = arg;
   }


   public Student(){}

   public Student(
      Boolean b0, 
      String...args)
   {
      this.isActive = b0;
      this.firstName = args[0];
      this.lastName = args[1];
      this.studentID = args[2];
   }
}
