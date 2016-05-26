package edu.stetson.forms.StudentForm;

import javax.validation.constraints.NotNull;
import org.hibernate.validator.constraints.NotBlank;
import org.hibernate.validator.constraints.Email;

public class StudentForm{
   @NotBlank
   String firstName;

   @NotBlank
   String lastName;

   @NotBlank
   String studentID;

   @NotNull
   Boolean isActive;

   @NotNull
   Integer credits;

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
   public IntegergetCredits() 
   {
      return this.credits;
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
   public Integer setCredits(Integer arg) 
   {
      this.credits = arg;
   }

   public StudentForm(){}

   public StudentForm(
      Boolean b0, 
      Integer i0, 
      String...args)
   {
      this.isActive = b0;
      this.credits = i0;
      this.firstName = args[0];
      this.lastName = args[1];
      this.studentID = args[2];
   }
   public ResultSetExtractor<StudentForm> getConsumer(){
      return new ResultSetExtractor<StudentForm>(){
         @Override
         public StudentForm extractData(ResultSet rs)
            throws SQLException, DataAccessException
         {
            rs.next();
            return new StudentForm(
               rs.getBoolean("rs_isactive"),
               rs.getInteger("rs_credits"),               ,
               new String[]{
                  rs.getString("rs_firstname"),
                  rs.getString("rs_lastname"),
                  rs.getString("spriden_pidm")
               }
            );
         }
      };
   }
}
