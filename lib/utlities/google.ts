import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import { supabase } from "./supabase";
import { useState } from "react";
  

	export const googleSignOut = async () => {
		try {
		  // Sign out from Google
		  await GoogleSignin.signOut();
	
		  // Sign out from Supabase
		  await supabase.auth.signOut();
	
		  // Clear the user info state
		  //setUserInfo(null);
	
		  console.log("User signed out successfully");
		} catch (error) {
		  console.error("Error signing out:", error);
		}
	  };