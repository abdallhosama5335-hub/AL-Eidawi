using System.Collections;
using UnityEngine;

public class Grass : MonoBehaviour
{
    private bool isCut;

    public bool TryCut(float delay)
    {
        if (isCut) return false;
        isCut = true;

        // تأثير بصري بسيط: تصغير العشبة قبل الاختفاء
        StartCoroutine(Shrink(delay));
        return true;
    }

    IEnumerator Shrink(float delay)
    {
        Vector3 startScale = transform.localScale;
        float t = 0f;
        while (t < delay)
        {
            t += Time.deltaTime;
            transform.localScale = Vector3.Lerp(startScale, Vector3.zero, t / delay);
            yield return null;
        }
        Destroy(gameObject);
    }
}
