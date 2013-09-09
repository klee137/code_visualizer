import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.NoSuchElementException;
import java.util.StringTokenizer;


public class parsing{
	/* main purpose of this program is to parse the lines one by one
	 * and create the arrays of commands that are easier for the user
	 * to translate into graphical feature 
	 */
	enum TYPES {INT,CHAR,SHORT,BYTE,DOUBLE,LONG,FLOAT,BOOLEAN};
	
	public static void main(String[] args) throws IOException{

		BufferedReader r = new BufferedReader(new FileReader("trial1.txt"));
		ArrayList<ArrayList<String>> storage = new ArrayList<ArrayList<String>>();
		ArrayList<String> arrStr;
		ArrayList<String>[] vstorage; //store variables according to types
		HashSet<String> search; //store all the variables

		storage = [];
		arrStr = []
		vstorage = []
		search = {}

		storage.push([ ... ])
		


		String ptr;
		String ptr2;
		String helper;
		int index =0;

		//initialize vstorage 0-int 1-char 2-short 3-byte 4-double 5-long 6-float 7-boolean
		vstorage=new ArrayList[8];
		for(int i=0;i<8;i++){
			vstorage[i] = new ArrayList<String>();
		}
		//initialize search hashset
		search =new HashSet<String>();

		//find the header first


		//store the main parts
		while((ptr=r.readLine())!=null){
			//adding sub-array list process
			arrStr = null;
			StringTokenizer s = new StringTokenizer(ptr);
			while(true){				
				try{
					ptr2=s.nextToken();
					if(arrStr==null){
						arrStr = new ArrayList<String>();
					}
					//covers the equals sign
					if((index=ptr2.indexOf("="))!=-1){
						if(!(helper=ptr2.substring(0,index)).equals("")){
							arrStr.add(helper);
						}
						arrStr.add(ptr2.substring(index,index+1));
						if(!(helper=ptr2.substring(index+1,ptr2.length())).equals("")){
							arrStr.add(helper);
						}
					} else{
						arrStr.add(ptr2);
					}


				} catch(NoSuchElementException e){
					break;
				}
			}

			if(arrStr!=null){

				//take out semicolon
				if(arrStr.get(arrStr.size()-1).equals(";")){
					arrStr.remove(arrStr.size()-1);
				}
				else if(arrStr.get(arrStr.size()-1).endsWith(";")){
					arrStr.set(arrStr.size()-1, arrStr.get(arrStr.size()-1).substring(0,(arrStr.get(arrStr.size()-1)).length()-1));
				}
				//put variables into the vstorage
				if(arrStr.get(0).equals("int")){
					vstorage[0].add(arrStr.get(1));
					search.add(arrStr.get(1));
				} else if(arrStr.get(0).equals("char")){
					vstorage[1].add(arrStr.get(1));
					search.add(arrStr.get(1));
				} else if(arrStr.get(0).equals("short")){
					vstorage[2].add(arrStr.get(1));
					search.add(arrStr.get(1));
				} else if(arrStr.get(0).equals("byte")){
					vstorage[3].add(arrStr.get(1));
					search.add(arrStr.get(1));
				} else if(arrStr.get(0).equals("double")){
					vstorage[4].add(arrStr.get(1));
					search.add(arrStr.get(1));
				} else if(arrStr.get(0).equals("long")){
					vstorage[5].add(arrStr.get(1));
					search.add(arrStr.get(1));
				} else if(arrStr.get(0).equals("float")){
					vstorage[6].add(arrStr.get(1));
					search.add(arrStr.get(1));
				} else if(arrStr.get(0).equals("boolean")){
					vstorage[7].add(arrStr.get(1));
					search.add(arrStr.get(1));
				}



				//finally add the string to the storage
				storage.add(arrStr);
			}





		}


		//testing parsing part
		for(int i=0;i<storage.size();i++){
			for(int j=0;j<storage.get(i).size();j++){
				System.out.print(storage.get(i).get(j)+",");	
			}
			System.out.println();
		}
		System.out.println();
		//testing vstorage part
		for(int i=0;i<8;i++){
			for(int j=0;j<vstorage[i].size();j++){
			
				System.out.print(vstorage[i].get(j)+" ");
			}
			System.out.println();
		}




	}









