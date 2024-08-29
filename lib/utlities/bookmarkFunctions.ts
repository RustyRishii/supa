import { ToastAndroid } from "react-native";
import { supabase } from "./supabase";

export default async function deleteBookmark(id: number) {
    const { data, error } = await supabase
      .from("Bookmarks")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting bookmark:", error);
    } else {
      console.log("Bookmark deleted successfully:", data);
      ToastAndroid.show("Deleted", ToastAndroid.SHORT);
      fetchBookmarks();
    }
  }
