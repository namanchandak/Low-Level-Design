interface TextFormatter {
     format(text: string): string;
 }
 
 class UpperCaseFormatter implements TextFormatter {
     format(text: string): string {
         return text.toUpperCase(); // TODO: Return text converted to upper case
     }
 }
 
 class LowerCaseFormatter implements TextFormatter {
     format(text: string): string {
         return text.toLocaleLowerCase(); // TODO: Return text converted to lower case
     }
 }
 
 class TitleCaseFormatter implements TextFormatter {
     format(text: string): string {
 
         return text.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());; // TODO: Split by space, capitalize first letter of each word, rejoin
     }
 }
 
 class TextEditor {
     private formatter: TextFormatter;
 
     constructor(formatter: TextFormatter) {
         this.formatter = formatter;
     }
 
     setFormatter(formatter: TextFormatter): void {
         this.formatter = formatter;
     }
 
     publishText(text: string): void {
         console.log(this.formatter.format(text));
     }
 }
 
 const editor = new TextEditor(new UpperCaseFormatter());
 editor.publishText("hello world from strategy pattern");
 
 editor.setFormatter(new LowerCaseFormatter());
 editor.publishText("Hello World From Strategy Pattern");
 
 editor.setFormatter(new TitleCaseFormatter());
 editor.publishText("hello world from strategy pattern");